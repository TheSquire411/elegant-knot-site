import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  guestIds: string[];
  message?: string;
  weddingDetails: {
    brideName: string;
    groomName: string;
    weddingDate: string;
    venue: string;
    address: string;
    time: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { guestIds, message, weddingDetails }: InvitationRequest = await req.json();

    // Fetch guests
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .in('id', guestIds)
      .eq('user_id', user.id);

    if (guestsError) {
      throw new Error(`Failed to fetch guests: ${guestsError.message}`);
    }

    const results = [];

    for (const guest of guests) {
      if (!guest.email) {
        results.push({
          guestId: guest.id,
          status: 'failed',
          error: 'No email address'
        });
        continue;
      }

      try {
        // Create invitation record
        const { data: invitation, error: inviteError } = await supabase
          .from('invitations')
          .insert({
            user_id: user.id,
            guest_id: guest.id,
            email: guest.email,
            status: 'pending'
          })
          .select()
          .single();

        if (inviteError) {
          throw new Error(`Failed to create invitation: ${inviteError.message}`);
        }

        const rsvpUrl = `https://rpcnysgxybcffnprttar.lovableproject.com/rsvp/${invitation.rsvp_token}`;
        
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">
              You're Invited to Our Wedding! 💍
            </h1>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h2 style="color: #333; text-align: center; margin-bottom: 20px;">
                ${weddingDetails.brideName} & ${weddingDetails.groomName}
              </h2>
              
              <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 18px; color: #666; margin: 5px 0;">
                  <strong>Date:</strong> ${weddingDetails.weddingDate}
                </p>
                <p style="font-size: 18px; color: #666; margin: 5px 0;">
                  <strong>Time:</strong> ${weddingDetails.time}
                </p>
                <p style="font-size: 18px; color: #666; margin: 5px 0;">
                  <strong>Venue:</strong> ${weddingDetails.venue}
                </p>
                <p style="font-size: 16px; color: #666; margin: 5px 0;">
                  ${weddingDetails.address}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Dear ${guest.first_name} ${guest.last_name || ''},
              </p>
              
              ${message ? `<p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">${message}</p>` : ''}
              
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 30px;">
                We would be honored to have you celebrate this special day with us. 
                Please let us know if you'll be able to join us by clicking the button below.
              </p>
              
              <a href="${rsvpUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; 
                        font-size: 18px; font-weight: bold; margin: 20px 0;">
                RSVP Now
              </a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
              <p>We can't wait to celebrate with you!</p>
              <p>With love,<br>${weddingDetails.brideName} & ${weddingDetails.groomName}</p>
            </div>
          </div>
        `;

        // Send email
        const emailResult = await resend.emails.send({
          from: 'Wedding Invitation <onboarding@resend.dev>',
          to: [guest.email],
          subject: `You're Invited: ${weddingDetails.brideName} & ${weddingDetails.groomName}'s Wedding`,
          html: emailContent
        });

        if (emailResult.error) {
          throw new Error(`Failed to send email: ${emailResult.error.message}`);
        }

        // Update invitation status
        await supabase
          .from('invitations')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', invitation.id);

        results.push({
          guestId: guest.id,
          status: 'sent',
          invitationId: invitation.id
        });

      } catch (error) {
        console.error(`Failed to send invitation to ${guest.email}:`, error);
        results.push({
          guestId: guest.id,
          status: 'failed',
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-wedding-invitations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});