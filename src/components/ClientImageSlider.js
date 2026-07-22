"use client";

import dynamic from 'next/dynamic';

const ImageSlider = dynamic(() => import('@/components/ImageSlider'), { ssr: false });

export default function ClientImageSlider(props) {
  return <ImageSlider {...props} />;
}
