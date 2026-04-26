import './style.css'
import { AppOrchestrator } from './ui/AppOrchestrator'

document.addEventListener('DOMContentLoaded', () => {
  const orchestrator = new AppOrchestrator()
  orchestrator.initialize()
})
