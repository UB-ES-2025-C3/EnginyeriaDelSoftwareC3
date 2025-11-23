export type FacetMap = Record<string, string[]>

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

const pushToMap = (map: FacetMap, key: string, rawValue: string) => {
  if (!map[key]) {
    map[key] = []
  }
  if (!map[key].includes(rawValue)) {
    map[key].push(rawValue)
  }
}

const genreRules: { key: string; patterns: string[] }[] = [
  { key: 'Acció', patterns: ['accio', 'accion', 'action'] },
  { key: 'Aventura', patterns: ['aventura', 'adventure'] },
  { key: 'RPG', patterns: ['rpg', 'role'] },
  { key: 'Estratègia', patterns: ['estrategia', 'strategy'] },
  { key: 'Shooter', patterns: ['shooter', 'fps', 'tps'] },
  { key: 'Puzzle', patterns: ['puzzle'] },
  { key: 'Carreres', patterns: ['carreres', 'racing', 'race'] },
  { key: 'Esport', patterns: ['esport', 'sport'] },
  { key: 'Simulació', patterns: ['simulacio', 'simulation', 'sim'] },
  { key: 'Metroidvania', patterns: ['metroidvania'] },
  { key: 'Sandbox', patterns: ['sandbox'] },
  { key: 'Open World', patterns: ['open world', 'mundo abierto', 'world obert'] },
]

const platformRules: { key: string; patterns: string[] }[] = [
  { key: 'PC', patterns: ['pc'] },
  { key: 'PlayStation', patterns: ['ps', 'playstation'] },
  { key: 'Xbox', patterns: ['xbox'] },
  { key: 'Switch', patterns: ['switch', 'nintendo'] },
  { key: 'Multi', patterns: ['multi'] },
]

const matchRules = (value: string, rules: { key: string; patterns: string[] }[]) =>
  rules
    .filter((rule) => rule.patterns.some((pattern) => value.includes(pattern)))
    .map((rule) => rule.key)

export const buildGenreMap = (rawGenres: string[]): FacetMap => {
  const map: FacetMap = {}

  rawGenres.forEach((raw) => {
    const trimmed = raw?.trim()
    if (!trimmed) return
    const normalized = normalize(trimmed)
    const matches = matchRules(normalized, genreRules)

    if (matches.length === 0) {
      pushToMap(map, trimmed, trimmed)
      return
    }

    matches.forEach((canonical) => pushToMap(map, canonical, trimmed))
  })

  return map
}

export const buildPlatformMap = (rawPlatforms: string[]): FacetMap => {
  const map: FacetMap = {}

  rawPlatforms.forEach((raw) => {
    const trimmed = raw?.trim()
    if (!trimmed) return
    const normalized = normalize(trimmed)
    const matches = matchRules(normalized, platformRules)

    if (matches.length === 0) {
      pushToMap(map, trimmed, trimmed)
      return
    }

    matches.forEach((canonical) => pushToMap(map, canonical, trimmed))
  })

  return map
}
