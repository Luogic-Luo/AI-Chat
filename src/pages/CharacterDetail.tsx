import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { charactersService } from '../services/characters'
import type { Character } from '../types'
import Chat from '../components/Chat'
import { auth } from '../services/auth'

export default function CharacterDetail() {
  const { id } = useParams()
  const [character, setCharacter] = useState<Character | undefined>()

  useEffect(() => {
    charactersService.ensureSeed()
    if (id) setCharacter(charactersService.getById(id))
  }, [id])

  if (!character) {
    return (
      <div className="min-h-screen px-6 py-10">
        <p className="text-sm text-gray-600 dark:text-gray-300">未找到该角色。</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold">{character.name}</h1>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{character.intro}</p>
      <div className="mt-2 text-xs text-gray-500">{character.tags.join(' · ')}</div>
      <div className="mt-6">
        <Chat character={character} userId={auth.currentUser()?.id} />
      </div>
    </div>
  )
}


