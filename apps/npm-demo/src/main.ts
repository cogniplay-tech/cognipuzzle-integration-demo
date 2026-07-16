import { createApp } from 'vue'
import { defineCogniplayPuzzle } from '@cogniplay/puzzle'
import App from './App.vue'

defineCogniplayPuzzle()
createApp(App).mount('#app')
