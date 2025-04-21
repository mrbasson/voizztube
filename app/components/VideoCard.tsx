import Image from 'next/image';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  duration: string;
}

export default function VideoCard({ thumbnail, title, duration }: VideoCardProps) {
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <Image
          src={thumbnail}
          alt={title}
          layout="fill"
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );
}
