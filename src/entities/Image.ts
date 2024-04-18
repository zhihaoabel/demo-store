export class Image {
  id: string
  src: string
  alt: string
  height: string
  width: string

  constructor(id: string, src: string, alt: string, height: string, width: string) {
    this.id = id
    this.src = src
    this.alt = alt
    this.height = height
    this.width = width
  }
}