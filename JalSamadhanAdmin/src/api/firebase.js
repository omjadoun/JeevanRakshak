import axios from 'axios'

const client = axios.create({
  baseURL: 'https://jalsamadhan-56704-default-rtdb.firebaseio.com',
  timeout: 10000,
})

function wrap(path) {
  return `${path}.json`
}

// SOS alerts are stored under /SOS in the mobile app
export async function fetchSOSAlerts() {
  try {
    console.log('Fetching SOS alerts from Firebase...')
    const { data } = await client.get(wrap('/SOS'))
    console.log('Raw SOS data:', data)
    
    if (!data) {
      console.log('No SOS data found')
      return []
    }

    const alerts = Object.entries(data).map(([id, value]) => {
      const v = value || {}
      return {
        id,
        ...v,
        // Normalised coordinate fields for the admin UI
        lat: v.latitude ?? v.lat,
        lng: v.longitude ?? v.lng,
      }
    })
    
    console.log('Processed alerts:', alerts)
    return alerts
  } catch (error) {
    console.error('Error fetching SOS alerts:', error)
    throw error
  }
}

export async function updateSOSAlertStatus(id, status) {
  await client.patch(wrap(`/SOS/${id}`), { status })
}

export async function deleteSOSAlert(id) {
  try {
    await client.delete(wrap(`/SOS/${id}`))
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}

// Resource requests are stored under /Resource
export async function fetchResourceRequests() {
  const { data } = await client.get(wrap('/Resource'))
  if (!data) return []

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...(value || {}),
  }))
}

export async function updateResourceRequest(id, solved) {
  // Mirror the mobile app's ApproveReq behaviour: fetch then overwrite with updated solved flag
  const { data } = await client.get(wrap(`/Resource/${id}`))
  const v = data || {}
  await client.put(wrap(`/Resource/${id}`), {
    details: v.details,
    add: v.add,
    latitude: v.latitude,
    longitude: v.longitude,
    cat: v.cat,
    solved,
  })
}

// Contributors are stored under /Contributor with `verified` flag
export async function fetchContributors() {
  const { data } = await client.get(wrap('/Contributor'))
  if (!data) return []

  return Object.entries(data).map(([id, value]) => {
    const v = value || {}
    return {
      id,
      name: v.Name,
      phone: v.Phone,
      organization: v.Category,
      state: v.State,
      approved: v.verified === 1 || v.verified === true,
    }
  })
}

export async function approveContributor(id, approved) {
  const { data } = await client.get(wrap(`/Contributor/${id}`))
  const v = data || {}
  await client.put(wrap(`/Contributor/${id}`), {
    Name: v.Name,
    Phone: v.Phone,
    Address: v.Address,
    Category: v.Category,
    State: v.State,
    Aadhar: v.Aadhar,
    Pan: v.Pan,
    Doc: v.Doc,
    verified: approved ? 1 : 0,
  })
}

// Announcements are under /announcement in the existing app
export async function fetchAnnouncements() {
  const { data } = await client.get(wrap('/announcement'))
  if (!data) return []

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...(value || {}),
  }))
}

export async function createAnnouncement(payload) {
  const { data } = await client.post(wrap('/announcement'), {
    createdAt: new Date().toISOString(),
    ...payload,
  })

  return data
}

