import { fabric } from 'fabric'

export interface CanvasState {
  canvas: fabric.Canvas | null
  tool: DrawingTool
  brushSize: number
  brushColor: string
  isDrawing: boolean
  history: CanvasHistory[]
  historyIndex: number
}

export type DrawingTool =
  | 'select'
  | 'brush'
  | 'pencil'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'text'
  | 'pan'

export interface CanvasHistory {
  id: string
  timestamp: number
  data: string // JSON representation of canvas state
}

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  objects: fabric.Object[]
}

export interface BrushSettings {
  size: number
  color: string
  opacity: number
  type: 'pencil' | 'brush' | 'spray'
}

export interface CanvasConfig {
  width: number
  height: number
  backgroundColor: string
  selection: boolean
  renderOnAddRemove: boolean
  centeredScaling: boolean
  centeredRotation: boolean
}