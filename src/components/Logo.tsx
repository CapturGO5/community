'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative w-[200px] h-[60px]">
        <Image
          src="/images/logo.png"
          alt="capturGO Community Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
