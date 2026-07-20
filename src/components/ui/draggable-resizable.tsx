import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import { cn } from '@/lib/utils';
import 'react-resizable/css/styles.css';

interface DraggableResizableProps {
  children: React.ReactNode;
  className?: string;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  disabled?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const DraggableResizable: React.FC<DraggableResizableProps> = ({
  children,
  className,
  initialWidth = 200,
  initialHeight = 100,
  initialX = 0,
  initialY = 0,
  disabled = false,
  minWidth = 50,
  minHeight = 30,
  maxWidth = 800,
  maxHeight = 600,
}) => {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleResize = (event: any, { size }: any) => {
    setSize({ width: size.width, height: size.height });
  };

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const AnyDraggable = Draggable as any;

  return (
    <AnyDraggable
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
      handle=".drag-handle"
    >
      <div ref={nodeRef} className="absolute">
        <Resizable
          width={size.width}
          height={size.height}
          onResize={handleResize}
          minConstraints={[minWidth, minHeight]}
          maxConstraints={[maxWidth, maxHeight]}
          resizeHandles={['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w']}
        >
          <div
            className={cn(
              "border border-dashed border-muted-foreground/30 bg-background/80 backdrop-blur-sm rounded-lg group hover:border-primary/50 transition-colors",
              className
            )}
            style={{
              width: size.width,
              height: size.height,
            }}
          >
            {/* Drag handle */}
            <div className="drag-handle absolute top-0 left-0 right-0 h-8 bg-muted/50 rounded-t-lg cursor-move flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-1 bg-muted-foreground/50 rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="p-2 pt-10 h-full overflow-hidden">
              {children}
            </div>
          </div>
        </Resizable>
      </div>
    </AnyDraggable>
  );
};