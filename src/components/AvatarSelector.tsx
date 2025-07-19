import Image from 'next/image';

const avatarOptions = [
  {
    id: 'purps',
    src: '/avatars/Purps.svg',
    alt: 'Purple Avatar'
  },
  {
    id: 'ninja',
    src: '/avatars/Ninja.svg',
    alt: 'Ninja Avatar'
  },
  {
    id: 'gold',
    src: '/avatars/Gold.svg',
    alt: 'Gold Avatar'
  },
  {
    id: 'moss',
    src: '/avatars/Moss.svg',
    alt: 'Moss Avatar'
  }
];

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  defaultAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

export default function AvatarSelector({ selectedAvatar, defaultAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white mb-4">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {avatarOptions.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.src)}
            className={`relative p-4 flex items-center justify-center rounded-lg transition-all ${
              (selectedAvatar || defaultAvatar) === avatar.src
                ? 'bg-white/10 ring-2 ring-white/20'
                : 'bg-[#1a1d24] hover:bg-white/5'
            }`}
          >
            <Image
              src={avatar.src}
              alt={avatar.alt}
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
