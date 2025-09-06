import { fabric } from 'fabric'

export interface ImportedImage {
  id: string
  name: string
  url: string
  fabricObject: fabric.Image | null
  width: number
  height: number
  selected: boolean
  position: {
    x: number
    y: number
  }
  scale: number
  thumbnail: string
}

export interface ImageImportOptions {
  autoArrange: boolean
  maxWidth?: number
  maxHeight?: number
  spacing?: number
}

export interface ImageSelection {
  images: ImportedImage[]
  bounds: {
    left: number
    top: number
    width: number
    height: number
  }
}