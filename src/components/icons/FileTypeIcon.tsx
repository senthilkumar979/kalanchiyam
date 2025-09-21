import { ArchiveIcon } from "./ArchiveIcon";
import { AudioIcon } from "./AudioIcon";
import { CSVIcon } from "./CSVIcon";
import { DocumentIcon } from "./DocumentIcon";
import { DocxIcon } from "./Docx";
import { JPEGIcon } from "./JPEGIcon";
import { OtherFileIcon } from "./OtherFileIcon";
import { PNGIcon } from "./PNGIcon";
import { PPTIcon } from "./PPTIcon";
import { SpreadsheetIcon } from "./SpreadsheetIcon";
import { SVGIcon } from "./SVGIcon";
import { VideoIcon } from "./VideoIcon";

interface FileTypeIconProps {
  fileName: string;
  className?: string;
}

export const FileTypeIcon = ({
  fileName,
  className = "w-5 h-5",
}: FileTypeIconProps) => {
  const extension = fileName?.split(".")?.pop()?.toLowerCase();

  const iconMap: Record<string, React.ElementType> = {
    pdf: DocumentIcon,
    docx: DocxIcon,
    doc: DocxIcon,
    txt: DocxIcon,
    jpg: JPEGIcon,
    jpeg: JPEGIcon,
    gif: JPEGIcon,
    heic: JPEGIcon,
    webp: JPEGIcon,
    bmp: JPEGIcon,
    tiff: JPEGIcon,
    svg: SVGIcon,
    csv: CSVIcon,
    png: PNGIcon,
    xlsx: SpreadsheetIcon,
    xls: SpreadsheetIcon,
    ods: SpreadsheetIcon,
    ppt: PPTIcon,
    pptx: PPTIcon,
    pptm: PPTIcon,
    mp4: VideoIcon,
    avi: VideoIcon,
    mov: VideoIcon,
    wmv: VideoIcon,
    flv: VideoIcon,
    webm: VideoIcon,
    mkv: VideoIcon,
    mp3: AudioIcon,
    wav: AudioIcon,
    flac: AudioIcon,
    aac: AudioIcon,
    ogg: AudioIcon,
    m4a: AudioIcon,
    zip: ArchiveIcon,
    rar: ArchiveIcon,
    "7z": ArchiveIcon,
    tar: ArchiveIcon,
    gz: ArchiveIcon,
    bz2: ArchiveIcon,
  };

  const IconComponent = iconMap[extension || ""] || OtherFileIcon;
  return <IconComponent className={className} />;
};
