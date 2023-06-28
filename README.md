# playwright-Humanize

![playwright-humanize](https://i.imgur.com/6yTUz3E.png)

## What is it

Humanizer functions for playwright

## Install

```shell
$ npm install @nicoandmee/playwright-humanize
```

## Philosophy

Provide a useful set of functions that complement playwright's interface to mask bot behavior. Is only concerned with humanization functions as opposed to an whole suite of evasions. For that, see [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra)

## Example

Below is an example of the `typeInto` function.

```typescript

import { typeInto, TypeIntoConfig } from "@nicoandmee/playwright-humanize"
import { launch, Browser, Page, ElementHandle } from "playwright-extra"


;( async () => {
    const browser: Browser = await launch()
    const page: Page = await browser.newPage()

    await page.goto(`https://foo.bar`)

    const input: ElementHandle | undefined = await page.$(`input#my-input`)

    if (input) {
        // Text to enter into input.
        const text: string = `Zero Cool? Crashed fifteen hundred and seven computers in one day? Biggest crash in history, front page New York Times August 10th, 1988. I thought you was black, man. YO THIS IS ZERO COOL!`
        // Optional action configuration.
        // See `schemas/configs.ts` for full configuration shape.
        const config: TypeIntoConfig = {
            mistakes: {
                chance: 8,
                delay: {
                    min: 50,
                    max: 500
                }
            },
            delays: {
                space: {
                    chance: 70,
                    min: 10,
                    max: 50
                }
            }
        }
        // Deploy the action...
        await typeInto(input, text, config)
    }

    console.log(`Input complete!`)
} )()


```

## Implemented

- [x] `typeInto(element, text, config)`

## Roadmap

- [ ] GAN Mouse movement actions
- [ ] Improve typing actions
- [ ] Suggest stuff in [Discord](https://extra.community/) or [Discussions](https://github.com/nicoandmee/playwright-humanize/discussions) (Not Issue Tracker)

## Contact
For private inquiries: [email](mailto:nico@omg.lol)

## Credits

Originally forked from [puppeteer-humanize](https://github.com/nicoandmee/puppeteer-humanize).