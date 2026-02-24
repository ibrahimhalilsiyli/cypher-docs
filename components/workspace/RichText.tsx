import { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Type, Palette } from 'lucide-react';
import clsx from 'clsx';

interface RichTextProps {
	content: string;
	onChange: (html: string) => void;
	placeholder?: string;
	readOnly?: boolean;
}

export default function RichText({ content, onChange, placeholder, readOnly }: RichTextProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const [showToolbar, setShowToolbar] = useState(false);
	const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

	useEffect(() => {
		if (editorRef.current && editorRef.current.innerHTML !== content) {
			editorRef.current.innerHTML = content;
		}
	}, []); // Only on mount to avoid cursor jumping

	const handleInput = () => {
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
	};

	const handleSelect = () => {
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0 && editorRef.current?.contains(selection.anchorNode)) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			setToolbarPos({
				top: rect.top - 50,
				left: rect.left + (rect.width / 2) - 100
			});
			setShowToolbar(true);
		} else {
			setShowToolbar(false);
		}
	};

	const execCmd = (cmd: string, value?: string) => {
		document.execCommand('styleWithCSS', false, 'true');
		document.execCommand(cmd, false, value);
		handleInput();
		// Keep toolbar open/update state if needed
	};

	return (
		<div className="relative group/richtext">
			{showToolbar && !readOnly && (
				<div
					className="fixed z-50 flex items-center gap-1 bg-surface border border-border shadow-xl rounded-lg p-1 animate-in fade-in zoom-in duration-200"
					style={{ top: toolbarPos.top, left: toolbarPos.left }}
				>
					<ToolbarBtn icon={Bold} onClick={() => execCmd('bold')} />
					<ToolbarBtn icon={Italic} onClick={() => execCmd('italic')} />
					<div className="w-px h-4 bg-border mx-1" />
					<ToolbarBtn icon={Type} onClick={() => execCmd('fontSize', '3')} label="S" />
					<ToolbarBtn icon={Type} onClick={() => execCmd('fontSize', '5')} label="L" />
					<div className="w-px h-4 bg-border mx-1" />
					{/* Simple Color Presets */}
					<button onClick={() => execCmd('foreColor', '#ef4444')} className="w-4 h-4 rounded-full bg-red-500 hover:scale-110 transition-transform" />
					<button onClick={() => execCmd('foreColor', '#3b82f6')} className="w-4 h-4 rounded-full bg-blue-500 hover:scale-110 transition-transform" />
					<button onClick={() => execCmd('foreColor', '#10b981')} className="w-4 h-4 rounded-full bg-green-500 hover:scale-110 transition-transform" />
				</div>
			)}

			<div
				ref={editorRef}
				contentEditable={!readOnly}
				onInput={handleInput}
				onBlur={() => setShowToolbar(false)} // Hide on blur, careful with buttons
				onMouseUp={handleSelect}
				onKeyUp={handleSelect}
				className={clsx(
					"w-full min-h-[24px] focus:outline-none empty:before:content-[attr(placeholder)] empty:before:text-text-muted/50 leading-relaxed",
					readOnly ? "cursor-default" : "cursor-text"
				)}
				placeholder={placeholder}
			/>
		</div>
	);
}

function ToolbarBtn({ icon: Icon, onClick, label }: any) {
	return (
		<button
			onMouseDown={(e) => { e.preventDefault(); onClick(); }} // onMouseDown prevents checking blur
			className="p-1.5 hover:bg-background rounded text-text-muted hover:text-text transition-colors flex items-center justify-center text-xs font-bold w-6 h-6"
		>
			{Icon ? <Icon size={14} /> : label}
		</button>
	)
}
