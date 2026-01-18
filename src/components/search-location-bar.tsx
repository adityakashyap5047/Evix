"use client";

import { searchEvents } from "@/actions/search";
import { getCurrentUser } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";
import { User } from "@/lib/Type";
import { City, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Calendar, Loader2, MapPin, Search } from "lucide-react";
import { debounce } from "lodash";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { getCategoryIcon } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getEventsByLocation } from "@/actions/events";
import { createLocationSlug } from "@/utils/location";

const SearchLocationBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: currentUserData, loading: isLoading } = useFetch(getCurrentUser);
  const currentUser: User | null = currentUserData?.user || null;

  const { fn: getEvents } = useFetch(getEventsByLocation, {
    autoFetch: false,
  })

  const searchArgs = searchQuery.trim().length >= 2 ? searchQuery : "skip"

  const { data: searchResultData, loading: searchLoading } = useFetch(searchEvents,
    {
      args: [
        searchArgs,
        5
      ]
    }
  );
  const searchResults = searchResultData?.events;

  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!selectedState) return [];
    const state = indianStates.find((s) => s.name === selectedState);
    if (!state) return [];
    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedState, indianStates]);

  useEffect(() => {
    if (currentUser?.location) {
      queueMicrotask(() => setSelectedCity(currentUser.location?.city ?? ""));
      queueMicrotask(() => setSelectedState(currentUser.location?.state ?? ""));
    }
  }, [currentUser, isLoading]);

  const debouncedSetQuery = useRef(
    debounce((value) => setSearchQuery(value), 300)
  ).current;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSetQuery(value);
    setShowSearchResults(value.length >= 2);
  }

  const handleEventClick = (slug: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/events/${slug}`);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && event.target && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = async (city: string, state: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    await getEvents(city, state, "India", false, 1, 5);
    const slug = createLocationSlug(city, state);
    router.push(`/explore/${slug}`);
  };

  return (
    <div className="flex items-center">
      <div className="relative flex w-full" ref={searchRef}>
        <div className="flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            onChange={handleSearchInput}
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSearchResults(true);
            }}
            className="pl-10 w-full h-9 rounded-none rounded-l-md"
          />
        </div>
        {showSearchResults && (
          <div className="absolute top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-100 overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                  SEARCH RESULTS
                </p>
                {searchResults.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event.slug)}
                    className="w-full cursor-pointer px-4 py-3 hover:bg-muted/50 text-left transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">
                        {(() => {
                          const Icon = getCategoryIcon(event.category);
                          return <Icon />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1 line-clamp-1">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(event.startDate, "MMM dd")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.city}
                          </span>
                        </div>
                      </div>
                      {event.ticketType === "FREE" && (
                        <Badge variant="secondary" className="text-xs">
                          Free
                        </Badge>
                      )}
                      {event.ticketType === "PAID" && (
                        <Badge variant="destructive" className="text-xs">
                          Paid
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
      <Select
        value={selectedState}
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedCity("");
        }}
      >
        <SelectTrigger className="w-32 h-9 border-l-0 rounded-none cursor-pointer">
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          {indianStates.map((state) => (
            <SelectItem key={state.isoCode} value={state.name} className="cursor-pointer">
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Select */}
      <Select
        value={selectedCity}
        onValueChange={(value) => {
          setSelectedCity(value);
          if (value && selectedState) {
            handleLocationSelect(value, selectedState);
          }
        }}
        disabled={!selectedState}
      >
        <SelectTrigger className="w-32 h-9 rounded-none rounded-r-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" disabled={!selectedState}>
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.name} value={city.name} className="cursor-pointer">
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

  )
}

export default SearchLocationBar