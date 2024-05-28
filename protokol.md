## Wstęp:
* - protokół sporządam w wersji "raw", nie zamierzam w nim podkolorowywać że wiem wszystko, zasadniczo dużo rzeczy nie wiem albo zapominam, natomiast doświadczenie/intuicja czasami podpowiadaja mi jakieś rozwiązania
* - pracujac jako freelancer nauczylem się, że przede wszystkim to klient końcowy musi być zadowolony, bo na koniec dnia to on robi mi przelew. Nie ma w tym glębszej filozofii, po prostu praca w pracy na etacie jest czasami więcej na "akademickie rozwazania" podczas gdy freelancking jest ściśle nastawiony na dowożenie.
* - Doswiadczenie jako freelancer nauczyło mnie dużo samodyscypliny, pojęcia "good is good enough. Perfectionism is source of suffer"

## Wymagania funcjonalne klienta
```
GitHub repositories and users autocomplete component


Your task is to create a reusable and self-contained autocomplete

component, which can fetch matching users and repositories for

a given string of characters.


Requirements:

- Don’t use an existing autocomplete library (even if in real life this would be preferred).

- Minimal chars number to initialize search: 3.

- Result items are combined and displayed alphabetically using repository and profile name as ordering keys.

- Number of result items should be limited to 50 per request.

- The component should give visual feedback for when the data is being fetched, the results are empty, or the request resulted in an error.

- The component supports keyboard strokes (up and down arrows to browse the results, enter to open a new tab with the repository/user page).

- The solution should also display a meaningful snippet of your ability to test the code.


Techstack: React, TypeScript.

Code challenge artifact: Url to a publicly accessible git repository. 
```

## Raw projekt rozbity na zadania, priorytetem
* Dowieźć funkcjonalność (bez testow) -> MILESTONE
* Stworzyć jakąś sensowną ale minimalistyczną identyfikację strony
* setup projektu (linter, eslint)
* otestować dziada, unit testami
* być może uda sie dowiesc testy e2e
* dunno jak to wyglada na githubie, ale jezeli powyzsze kroki zostana spelnione, skorzystac z jakiegos CI (nigdy nie korzystalem, ale moze github actions?) w celu automatyzacji stage testow




## notatnik
20:41 start


Najpierw skupilem sie na stworzeniu działającego prototypu, w tym celu skorzystałem z openAI w celu wygenerowania działającego rozwiązania. Na potrzebe pierwszego PoC wykorzystalem autocomplete z MUI (a przy okazji sprawdzę jakie featury MUI autocomplete chowa w kodzie źródłowym) zasadniczo tego typu PoC zajmuje krótką chwile, ale już teraz widze, ze chat nieoptymalnie wykorzystuje fetch w useEffect.
* n

```
 useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersResponse = await axios.get(`https://api.github.com/search/users?q=${query}&per_page=50`);
        const reposResponse = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=50`);
        
        const combinedResults = [
          ...usersResponse.data.items.map((item: any) => ({ id: item.id, login: item.login, html_url: item.html_url })),
          ...reposResponse.data.items.map((item: any) => ({ id: item.id, name: item.name, html_url: item.html_url }))
        ];

        combinedResults.sort((a, b) => {
          const nameA = a.login || a.name || '';
          const nameB = b.login || b.name || '';
          return nameA.localeCompare(nameB);
        });

        setResults(combinedResults);
      } catch (err) {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);
```


```
export type FilterValues = {
  Q: string;
  urlState?: string;
  filterValues?: FilterValue;
}
    const hasChanged = filterValues && prevFilterValues &&
      Object.keys(filterValues).some(key => filterValues[key] !== prevFilterValues[key]);
```