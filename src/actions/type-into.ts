import { TypeIntoSchema } from "../schemas"
import {
  chance,
  debug,
  detectCharType,
  isCadence,
  keypressDelay,
  Timer,
  waitForTimeout
} from "../support"
import {
  BoundingBox,
  CharacterType,
  Cursor,
  CursorClickOpts,
  ElementHandle,
  PerformanceTimer,
  TypeIntoOptions
} from "../types"
import { typeMistake } from "./type-mistake"

/**
 * Humanizes text input into a specified element.
 *
 * @param {ElementHandle} element
 * @param {string} text
 * @param {TypeIntoOptions} config
 * @return {Promise<PerformanceTimer>}
 */
export const typeInto = async (
  element: ElementHandle,
  cursor: Cursor,
  text: string,
  config: TypeIntoOptions = {}
): Promise<PerformanceTimer> => {
  // Validate config and inject defaults.
  const { delays, mistakes } = TypeIntoSchema.parse(config)

  // Start performance timer for logging.
  const timer: PerformanceTimer = new Timer().start()

  // Break input string into individual letters.
  const chars: string[] = [...text]

  // Determine bounding box of element.
  const boundingBox: BoundingBox = (await element.boundingBox()) as BoundingBox

  // Click element to allow text input.
  await cursor.actions.click({
    target: boundingBox,
    waitBeforeClick: [50, 100],
    waitBetweenClick: [50, 100]
  } as CursorClickOpts)

  // Type each character in sequence.
  let position: number = 0
  for (const char of chars) {
    const charType: CharacterType | undefined = detectCharType(char)
    // Add potential for mistakes while typing.
    if (charType !== "termination") {
      await typeMistake(element, char, mistakes)
    }

    // Delay slightly before punctuation.
    if (charType === "punctuation") {
      await waitForTimeout({ min: 50, max: 100 })
    }

    // Type the correct character and add post type delay.
    if (charType === "upper") {
      await cursor.page.keyboard.press(`Shift+${char}`, keypressDelay())
    } else {
      await element.press(char, keypressDelay())
    }

    await waitForTimeout(delays.all)

    // Add longer delay after sentence termination or punctuation.
    if (
      charType &&
      (charType === "punctuation" || charType === "termination") &&
      Object.keys(delays).includes(charType)
    ) {
      await waitForTimeout(delays[charType])
    }

    // Vary longer delays on natural typing cadences.
    if (isCadence(position) && chance(delays.cadence.chance)) {
      await waitForTimeout(delays.cadence)
    }

    // Increment counter for cadence tracking.
    position++
  }

  // Press tab to remove focus from element.
  await element.press("Tab", keypressDelay())

  // Pause a moment after finishing input.
  await waitForTimeout(delays.complete)

  // Stop and return performance timer.
  timer.stop()

  debug(`Typed "${text}" over ${timer.duration()}ms.`)
  return timer
}
