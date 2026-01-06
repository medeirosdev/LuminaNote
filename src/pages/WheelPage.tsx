/**
 * @fileoverview Random Decision Wheel Page
 * 
 * An interactive spinning wheel with 6 customizable options.
 * Click to spin, click labels to edit them.
 * 
 * @module pages/WheelPage
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Edit2 } from 'lucide-react';
import { useWheel } from '../hooks/useWheel';
import { useToast } from '../hooks/useToast';

export function WheelPage() {
    const { options, updateOptionLabel, getRandomOption, resetOptions } = useWheel();
    const { showToast } = useToast();

    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const spinWheel = useCallback(() => {
        if (isSpinning) return;

        setIsSpinning(true);
        setSelectedOption(null);

        // Get random result
        const result = getRandomOption();
        const optionIndex = options.findIndex(o => o.id === result.id);

        // Calculate rotation: multiple full spins + land on the option
        // Each segment is 60 degrees (360 / 6)
        const segmentAngle = 360 / options.length;
        const targetAngle = 360 - (optionIndex * segmentAngle + segmentAngle / 2);
        const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
        const newRotation = rotation + (fullSpins * 360) + targetAngle + (Math.random() * 30 - 15);

        setRotation(newRotation);

        // Show result after animation
        setTimeout(() => {
            setIsSpinning(false);
            setSelectedOption(result.label);
            showToast(`🎯 ${result.label}!`, 'success');
        }, 4000);
    }, [isSpinning, rotation, options, getRandomOption, showToast]);

    const startEditing = (id: string, currentLabel: string) => {
        setEditingId(id);
        setEditValue(currentLabel);
    };

    const saveEdit = () => {
        if (editingId && editValue.trim()) {
            updateOptionLabel(editingId, editValue.trim());
        }
        setEditingId(null);
        setEditValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditValue('');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-zen-text mb-2">Decision Wheel</h1>
                <p className="text-zen-text-secondary">
                    Can't decide? Let the wheel choose for you! Click the wheel to spin.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Wheel Container */}
                <div className="relative">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] 
                            border-l-transparent border-r-transparent border-t-zen-accent
                            drop-shadow-lg" />
                    </div>

                    {/* Spinning Wheel */}
                    <motion.div
                        className="relative w-72 h-72 cursor-pointer"
                        onClick={spinWheel}
                        animate={{ rotate: rotation }}
                        transition={{
                            duration: 4,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                    >
                        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                            {options.map((option, index) => {
                                const angle = (360 / options.length) * index;
                                const startAngle = angle - 90;
                                const endAngle = startAngle + (360 / options.length);

                                const startRad = (startAngle * Math.PI) / 180;
                                const endRad = (endAngle * Math.PI) / 180;

                                const x1 = 100 + 95 * Math.cos(startRad);
                                const y1 = 100 + 95 * Math.sin(startRad);
                                const x2 = 100 + 95 * Math.cos(endRad);
                                const y2 = 100 + 95 * Math.sin(endRad);

                                const largeArc = (360 / options.length) > 180 ? 1 : 0;

                                const path = `M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArc} 1 ${x2} ${y2} Z`;

                                // Text position (center of segment)
                                const midAngle = ((startAngle + endAngle) / 2) * Math.PI / 180;
                                const textX = 100 + 55 * Math.cos(midAngle);
                                const textY = 100 + 55 * Math.sin(midAngle);
                                const textRotation = (startAngle + endAngle) / 2 + 90;

                                return (
                                    <g key={option.id}>
                                        <path
                                            d={path}
                                            fill={option.color}
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                        <text
                                            x={textX}
                                            y={textY}
                                            fill="white"
                                            fontSize="10"
                                            fontWeight="600"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                                            className="pointer-events-none select-none"
                                        >
                                            {option.label.length > 10
                                                ? option.label.substring(0, 10) + '...'
                                                : option.label}
                                        </text>
                                    </g>
                                );
                            })}
                            {/* Center circle */}
                            <circle cx="100" cy="100" r="15" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                            <circle cx="100" cy="100" r="8" fill="#6366f1" />
                        </svg>
                    </motion.div>

                    {/* Spin instruction */}
                    {!isSpinning && !selectedOption && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mt-4 text-zen-text-muted text-sm"
                        >
                            Click to spin!
                        </motion.p>
                    )}
                </div>

                {/* Options Panel */}
                <div className="flex-1 w-full lg:w-auto">
                    {/* Selected Result */}
                    <AnimatePresence>
                        {selectedOption && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="mb-6 p-6 bg-gradient-to-br from-zen-accent/20 to-zen-sage/20 
                                    rounded-xl border border-zen-accent/30 text-center"
                            >
                                <Sparkles className="w-8 h-8 mx-auto mb-2 text-zen-accent" />
                                <p className="text-sm text-zen-text-secondary mb-1">The wheel has spoken!</p>
                                <p className="text-2xl font-bold text-zen-text">{selectedOption}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Edit Options */}
                    <div className="bg-zen-card rounded-xl border border-zen-border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-zen-text">Options</h3>
                            <button
                                onClick={resetOptions}
                                className="text-xs text-zen-text-muted hover:text-zen-text 
                                    flex items-center gap-1 transition-colors"
                            >
                                <RotateCcw size={12} />
                                Reset
                            </button>
                        </div>

                        <div className="space-y-2">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zen-surface transition-colors"
                                >
                                    <div
                                        className="w-4 h-4 rounded-full shrink-0"
                                        style={{ backgroundColor: option.color }}
                                    />

                                    {editingId === option.id ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={saveEdit}
                                            onKeyDown={handleKeyDown}
                                            className="flex-1 px-2 py-1 text-sm bg-zen-bg border border-zen-border 
                                                rounded text-zen-text focus:outline-none focus:border-zen-accent"
                                            maxLength={20}
                                        />
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm text-zen-text">{option.label}</span>
                                            <button
                                                onClick={() => startEditing(option.id, option.label)}
                                                className="p-1 text-zen-text-muted hover:text-zen-accent transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
