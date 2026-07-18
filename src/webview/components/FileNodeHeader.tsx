import { WebviewMessageType } from '../../shared/messages';
import { FileNode } from '../../shared/types';
import { sendToExtension } from '../utils/vscodeApi';
import { HoverScrollText } from './HoverScrollText';


export function FileNodeHeader({ fileNode }: { fileNode: FileNode }) {
	const lastSlash = Math.max(fileNode.filePath.lastIndexOf('/'), fileNode.filePath.lastIndexOf('\\')) + 1;
	const fileName = fileNode.filePath.slice(lastSlash);

	const openFile = () => {
		sendToExtension({ type: WebviewMessageType.OpenLocation, file: fileNode.filePath, line: 0 });
	};

	const removeFileNode = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension({ type: WebviewMessageType.RemoveFileNodes, filePaths: [fileNode.filePath] });
	};

	return (
		<div
			className="group flex cursor-pointer items-center px-2 py-0.75 font-bold whitespace-nowrap bg-(--vscode-editorGroupHeader-tabsBackground) border-b border-(--vscode-editorWidget-border)"
			title={fileNode.filePath}
			onClick={openFile}
		>
			<span className="mr-1 hidden min-w-0 flex-1 overflow-hidden font-normal opacity-70 group-hover:block">
				<HoverScrollText>{fileNode.filePath}</HoverScrollText>
			</span>

			<span className="min-w-0 flex-1 overflow-hidden text-ellipsis group-hover:hidden">
				{fileName}
			</span>

			<button
				className="nodrag ml-1 shrink-0 cursor-pointer px-1 font-normal opacity-50 hover:opacity-100 hover:text-(--vscode-errorForeground,#f66)"
				title="Remove file node"
				onClick={removeFileNode}
			>
				×
			</button>
		</div>
	);
}
