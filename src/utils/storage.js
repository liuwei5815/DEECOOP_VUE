const mystorage = {
	set: (key, value) => {
		if(value) {
			sessionStorage.setItem(key, JSON.stringify(value))
		}
	},
	get: (key) => {
		return JSON.parse(sessionStorage.getItem(key))
	},
	remove: (key) => {
		sessionStorage.removeItem(key)
	},
	clear: () => {
		sessionStorage.clear()
	},
  localSet: (key, value) => {
    if(value) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },
  localGet: (key) => {
	  return JSON.parse(localStorage.getItem(key))
  },
  localRemove: (key) => {
    localStorage.removeItem(key)
  },
  localClear: () => {
    localStorage.clear()
  },
}

export default mystorage
