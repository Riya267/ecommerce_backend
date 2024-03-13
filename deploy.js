const fetch = require('node-fetch')
const core = require('@actions/core')

const SERVICE_ID = core.getInput('SERVICE_KEY') || process.env.SERVICE_ID
const API_KEY = core.getInput('API_KEY') || process.env.API_KEY
const DOCKER_IMG_URL =
  core.getInput('DOCKER_IMG_URL') || process.env.DOCKER_IMG_URL

async function deploy() {
    const url = `https://api.render.com/deploy/${SERVICE_ID}?key=${API_KEY}&imgURL=${DOCKER_IMG_URL}`
    const getResponse = await fetch(url)
    let status = ''
    if (getResponse.ok) {
      const data = (await getResponse.json())
      status = data.status
    } else {
      throw new Error('Could not retrieve deploy information.')
    }

    if (status !== previousStatus) {
      core.info(`Deploy status: ${status}`)
      previousStatus = status
    }

    if (
      status.endsWith('failed') ||
      status === 'canceled' ||
      status === 'deactivated'
    ) {
      core.setFailed(`Deploy status: ${status}`)
      return
    }

    if (status === 'live') {
      core.info(`Deploy finished successfully`)
      return
    }
  }

async function run() {
  try {
    await deploy()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
