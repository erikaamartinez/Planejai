const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
  const saveFormData = (formData) => {
    const id = crypto.randomUUID()
    const record = { ...formData, id }

    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage ? JSON.parse(storage) : []

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }

  const getFormData = (id) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storage) {
      return null
    }

    const savedData = JSON.parse(storage)
    return savedData.find((record) => record.id === id) || null
  }

  const updateSimulation = (id, updatedData) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage ? JSON.parse(storage) : []
    const updated = savedData.map((record) =>
      record.id === id ? { ...record, ...updatedData } : record,
    )
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const getAllSimulations = () => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storage ? JSON.parse(storage) : []
  }

  const deleteSimulation = (id) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage ? JSON.parse(storage) : []
    const updated = savedData.filter((record) => record.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    return updated
  }

  return {
    saveFormData,
    getFormData,
    updateSimulation,
    getAllSimulations,
    deleteSimulation,
  }
}
