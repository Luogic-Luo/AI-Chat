export type LLMConfig = {
  baseUrl: string
  apiKey: string
  model: string
}

const KEY = 'chatai_llm_config'

export const defaultConfig: LLMConfig = {
  baseUrl: 'https://openai.qiniu.com/v1',
  apiKey: import.meta.env.VITE_API_KEY,
  model: 'deepseek-v3',
}

export const llmConfig = {
  get(): LLMConfig {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? { ...defaultConfig, ...(JSON.parse(raw) as Partial<LLMConfig>) } : defaultConfig
    } catch {
      return defaultConfig
    }
  },
  set(cfg: Partial<LLMConfig>) {
    const merged = { ...llmConfig.get(), ...cfg }
    localStorage.setItem(KEY, JSON.stringify(merged))
  },
  clear() {
    localStorage.removeItem(KEY)
  },
}


