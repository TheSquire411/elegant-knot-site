import { formatTime } from '../../../../utils/previewUtils';

interface ScheduleSectionProps {
  schedule: {
    ceremony: {
      time: string;
      location: string;
    };
    reception: {
      time: string;
      location: string;
    };
  };
  theme: {
    colorPalette: {
      primary: string;
      text: string;
    };
    typography: {
      headingFont: string;
      headingWeight: number;
    };
  };
}

export default function ScheduleSection({ schedule, theme }: ScheduleSectionProps) {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl text-center mb-12"
          style={{
            fontFamily: theme.typography.headingFont,
            fontWeight: theme.typography.headingWeight,
            color: theme.colorPalette.primary
          }}
        >
          Schedule
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colorPalette.primary }}>
              Ceremony
            </h3>
            <p 
              className="text-lg font-medium mb-2"
              style={{ color: theme.colorPalette.text }}
            >
              {formatTime(schedule.ceremony.time)}
            </p>
            <p style={{ color: theme.colorPalette.text, opacity: 0.7 }}>{schedule.ceremony.location}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colorPalette.primary }}>
              Reception
            </h3>
            <p 
              className="text-lg font-medium mb-2"
              style={{ color: theme.colorPalette.text }}
            >
              {formatTime(schedule.reception.time)}
            </p>
            <p style={{ color: theme.colorPalette.text, opacity: 0.7 }}>{schedule.reception.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}