import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/images/voizz-logo.png"
        alt="VoizzTube Logo"
        width={200}
        height={100}
        className="dark:invert"
        priority
      />
    </div>
  );
}
