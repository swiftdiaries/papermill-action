import * as core from '@actions/core'
import * as exec from '@actions/exec'

//-----------------------------------------------------------------------
// Interfaces
// Source: https://github.com/goanpeca/setup-miniconda/blob/master/src/setup-conda.ts#L12
//-----------------------------------------------------------------------
interface SucceedResult {
  ok: boolean
  data: string | undefined
}
interface FailedResult {
  ok: boolean
  error: Error
}
type Result = SucceedResult | FailedResult

/**
 * Run exec.exec with error handling
 * Source: https://github.com/goanpeca/setup-miniconda/blob/master/src/setup-conda.ts#L62
 */
async function execute(command: string): Promise<Result> {
  const options = {listeners: {}}
  let stringData: string
  options.listeners = {
    stdout: (data: Buffer) => {
      //core.info(data.toString())
    },
    stderr: (data: Buffer) => {
      stringData = data.toString()
      // These warnings are appearing on win install, we can swallow them
      if (
        !stringData.includes('menuinst_win32') &&
        !stringData.includes('Unable to register environment') &&
        !stringData.includes('0%|')
      ) {
        core.warning(stringData)
      }
    }
  }

  try {
    await exec.exec(command, [], options)
  } catch (err) {
    return {ok: false, error: err}
  }

  return {ok: true, data: undefined}
}

// export async function setupIPythonKernel(): Promise<void> {}

export async function runNotebook(
  inputNotebookPath: string,
  outputNotebookPath: string
): Promise<Result> {
  core.debug(`Input Notebook Path: ${inputNotebookPath}`)
  core.debug(`Output Notebook Path: ${outputNotebookPath}`)

  const command = `papermill ${inputNotebookPath} ${outputNotebookPath}`

  let result: any
  try {
    result = await execute(command)
  } catch (err) {
    core.error(err)
    return {ok: false, error: err}
  }
  return {ok: true, data: result['data']}
}
