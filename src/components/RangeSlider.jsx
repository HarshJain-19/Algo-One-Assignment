import React, { useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';

const RangeSlider = ({ max, dataCount, setDataCount }) => {
  const [slideVal, setSlideVal] = useState([10]);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div>
      <h3 className='text-sm font-medium'>Filter Results</h3>
      <div className='flex items-center gap-x-2 my-5'>
        {0}
        <Slider 
          value={slideVal} 
          onValueChange={v => {setSlideVal(v); setDataCount(v[0])}} 
          max={max} 
          step={2} 
          onPointerDown={() => setIsDragging(true)} 
          onPointerUp={() => setIsDragging(false)} 
          isDragging={isDragging}
          className='w-36' 
        />
        {max}
      </div>
    </div>
  )
}

export default RangeSlider
