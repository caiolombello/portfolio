---
title_pt: "React Hooks Avançados"
title_en: "Advanced React Hooks"
title_es: "Hooks Avanzados de React"
summary_pt: "Explorando hooks personalizados e padrões avançados no React"
summary_en: "Exploring custom hooks and advanced patterns in React"
summary_es: "Explorando hooks personalizados y patrones avanzados en React"
publicationDate: "2024-01-05"
category: "React"
tags: ["react", "hooks", "javascript", "frontend", "performance", "otimização"]
published: true
author:
  name: "Caio Lombello"
  avatar: ""
---

# React Hooks Avançados

Os React Hooks revolucionaram a forma como desenvolvemos componentes, permitindo lógica de estado complexa em componentes funcionais.

## Custom Hooks

Criar hooks personalizados permite reutilizar lógica entre componentes:

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## useCallback para Performance

Evite re-renderizações desnecessárias:

```tsx
const handleClick = useCallback(() => {
  // Função só é recriada se dependências mudarem
}, [dependency]);
```

## useMemo para Computações Caras

```tsx
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);
```

## useReducer para Estados Complexos

Para lógica de estado mais complexa que useState:

```tsx
function useCounter(initialValue = 0) {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'increment':
          return { count: state.count + 1 };
        case 'decrement':
          return { count: state.count - 1 };
        case 'reset':
          return { count: initialValue };
        default:
          throw new Error();
      }
    },
    { count: initialValue }
  );

  return [state, dispatch] as const;
}
```

## Conclusão

Dominar hooks avançados permite criar aplicações React mais performáticas e maintíveis. A chave é entender quando usar cada hook e como combiná-los efetivamente.

## Dicas de Performance

1. **Evite criação desnecessária** com useCallback e useMemo
2. **Separe concerns** com custom hooks
3. **Use useReducer** para estados complexos
4. **Optimize re-renders** com React.memo quando necessário 