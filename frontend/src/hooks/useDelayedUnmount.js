import { useState, useEffect } from 'react'

export function useDelayedUnmount(open, delay = 150) {
  const [render, setRender] = useState(open)

  useEffect(() => {
    if (open) setRender(true)
    else {
      const t = setTimeout(() => setRender(false), delay)
      return () => clearTimeout(t)
    }
  }, [open, delay])

  return render
}