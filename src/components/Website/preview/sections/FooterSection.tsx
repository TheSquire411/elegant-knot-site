import { formatDate } from '../../../../utils/previewUtils';

interface FooterSectionProps {
  coupleNames: string;
  weddingDate: string;
}

export default function FooterSection({ coupleNames, weddingDate }: FooterSectionProps) {
  return (
    <footer className="py-8 px-6 bg-gray-800 text-white text-center">
      <p className="mb-2">
        {coupleNames}
      </p>
      <p className="text-gray-400">
        {formatDate(weddingDate)}
      </p>
    </footer>
  );
}