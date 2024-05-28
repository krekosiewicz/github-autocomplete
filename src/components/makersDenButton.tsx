import { FC } from 'react'

interface MakersDenClipButtonProps {
  id: string;
  label: string;
  handleClick: (id: string) => void;
  isDisabled: boolean;
}

export const MakersDenClipButton: FC<MakersDenClipButtonProps> = ({ id, label, handleClick, isDisabled }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-md font-semibold gap-2 px-6 py-2 focus-visible:ring-primary-500 focus:outline-none focus-visible:ring shadow-inherit transition-all duration-[250ms] whitespace-pre border border-green-makers-den Button_glow-effect ${
        isDisabled
          ? 'bg-gray-400 text-gray-600 pointer-events-none'
          : 'bg-green text-green-makers-den cursor-pointer hover:shadow-[0_0_6px_#6DDA84,inset_0_0_6px_#6DDA84]'
      }`}
      onClick={() => !isDisabled && handleClick(id)}
    >
      {label}
    </div>
  );
};
