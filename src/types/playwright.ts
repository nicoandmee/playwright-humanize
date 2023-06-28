import type * as Playwright from "playwright-core"

export type Page = Playwright.Page
export type ElementHandle = Playwright.ElementHandle
export interface BoundingBox {
  /**
   * the x coordinate of the element in pixels.
   */
  x: number

  /**
   * the y coordinate of the element in pixels.
   */
  y: number

  /**
   * the width of the element in pixels.
   */
  width: number

  /**
   * the height of the element in pixels.
   */
  height: number
}
