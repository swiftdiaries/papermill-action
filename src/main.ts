import * as core from '@actions/core'
import {runNotebook} from './papermill'

async function run(): Promise<void> {
  try {
    const nb: string = core.getInput('input')
    const out: string = core.getInput('output')

    const result = (await runNotebook(nb, out)) as any
    if (!result['ok']) {
      throw result['error']
    }
    core.setOutput('out', out)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
