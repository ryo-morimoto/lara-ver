import { redirectService } from './redirect-service'

export interface WebRequestDetails {
  url: string
  tabId?: number
  requestId: string
  frameId: number
  parentFrameId: number
  method: string
  timeStamp: number
  type: string
}

export interface WebRequestResponse {
  redirectUrl?: string
}

export async function handleWebRequest(
  details: WebRequestDetails,
): Promise<WebRequestResponse | undefined> {
  try {
    const result = await redirectService.shouldRedirectURL(details.url)

    if (result.shouldRedirect && result.redirectUrl !== null) {
      console.warn(`Redirecting ${details.url} to ${result.redirectUrl}`)
      return { redirectUrl: result.redirectUrl }
    }
  }
  catch (error) {
    console.error('Error in webRequest handler:', error)
  }

  // Return undefined to allow the request to proceed normally
  return undefined
}
