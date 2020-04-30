export async function wait(milliseconds: number): Promise<string> {
  return new Promise(resolve => {
    if (isNaN(milliseconds)) {
      throw new Error('milliseconds not a number')
    }

    setTimeout(() => resolve('done!'), milliseconds)
  })
}

export async function installPapermill(): Promise<string> {
  let papermillPath: string = "/home/runner/papermill"

  return papermillPath
}
