import { faFile, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

const DragStyledDiv = styled.div`
  border: var(--borderWidth-thicker) dashed var(--borderColor-default);
  border-radius: var(--borderRadius-large);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--base-size-12);
  cursor: pointer;
`;
export function UploadFileDiv({
  processFile,
  uploadPorgess = false,
  acceptedTypes,
  ...props
}: {
  processFile: (file: File) => void;
  acceptedTypes?: string;
  uploadPorgess?: boolean | number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files?.length > 0) {
        processFile(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    },
    [processFile]
  );

  return (
    <DragStyledDiv
      draggable
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      {...props}
    >
      <input
        hidden
        type="file"
        ref={fileInputRef}
        accept={acceptedTypes}
        onChange={(e) => {
          if (e.target.files?.length) processFile(e.target.files[0]);
          e.target.files = null;
        }}
      />
      {uploadPorgess !== false ? (
        <FontAwesomeIcon icon={faSpinner} spinPulse size="4x" />
      ) : (
        <FontAwesomeIcon icon={faFile} size="4x" />
      )}
      <div style={{ fontSize: "var(--text-title-size-medium)" }}>
        {uploadPorgess === true
          ? "正在上传"
          : typeof uploadPorgess === "number"
            ? "上传进度：" + Math.round(uploadPorgess * 100) + "%"
            : isDragging
              ? "松开文件以上传"
              : "点击上传文件或拖动文件到此处"}
      </div>
    </DragStyledDiv>
  );
}
