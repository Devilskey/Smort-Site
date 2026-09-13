import { ReactElement, useEffect, useState } from "react";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortPc } from "../../component/NavbarPc";
import { Container, Spinner } from "react-bootstrap";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";

import Style from './SearchPage.module.scss';
import { smortApi as smort } from "../../Api/smortApi";
import { SearchAll } from "../../Api/ApiObjects/SearchAll";

export const SearchPage = (): ReactElement => {
    const [isSearching , setIsSearching] = useState(true);
    const [results , setResults] = useState<SearchAll>({ posts: [], users: [] });
    const [query , setQuery] = useState("");
      const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timer);

    });
    
    useEffect(() => {
        if (!debouncedQuery.trim()) return; 

        console.log("Searching for:", debouncedQuery);  
        setIsSearching(true);

        smort.SearchAll(debouncedQuery)
            .then(async (response) => {
                setResults(response);
                console.log("Search results:", await response);
                setIsSearching(false);
            })
            .catch((error) => {
                console.error("Error searching:", error);
                setIsSearching(false);
            });

    }, [debouncedQuery]);
    
    return (
      <div className={Style.Page}> 
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={(test: string) => { }} />
        }

        <Container className={Style.SearchPageContainer}>
            <div className={Style.SearchSection}>
                <input
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className={Style.ResultsSection}>
                {(isSearching && query !== "" )&& <Spinner />}
            </div>
        </Container>

        {AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={(test: string) => { }} />
        }
      </div>
    );
}