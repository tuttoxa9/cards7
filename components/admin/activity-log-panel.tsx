"use client";

import { useState, useEffect, useMemo } from "react";
import { User } from "firebase/auth";
import { collection, query, orderBy, getDocs, Timestamp, where, QueryConstraint, limit, startAfter, DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";

interface LogEntry {
  id: string;
  timestamp: Timestamp;
  userId: string;
  userName: string;
  actionType: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  entityType: string;
  description: string;
}

interface ActivityLogPanelProps {
  user: User;
}

export function ActivityLogPanel({ user }: ActivityLogPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    user: "all",
    entityType: "all",
  });

  const [uniqueUsers, setUniqueUsers] = useState<string[]>([]);
  const [uniqueEntityTypes, setUniqueEntityTypes] = useState<string[]>([]);
  const LOGS_PER_PAGE = 20;

  const fetchLogs = async (loadMore = false) => {
    if (!loadMore) {
      setIsLoading(true);
      setLogs([]);
      setLastDoc(null);
    } else {
      if (!lastDoc) return;
      setIsFetchingMore(true);
    }

    try {
      const constraints: QueryConstraint[] = [orderBy("timestamp", "desc"), limit(LOGS_PER_PAGE)];

      if (filters.dateFrom) constraints.push(where("timestamp", ">=", Timestamp.fromDate(filters.dateFrom)));
      if (filters.dateTo) {
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        constraints.push(where("timestamp", "<=", Timestamp.fromDate(endOfDay)));
      }
      if (filters.user !== "all") constraints.push(where("userName", "==", filters.user));
      if (filters.entityType !== "all") constraints.push(where("entityType", "==", filters.entityType));
      if (loadMore && lastDoc) constraints.push(startAfter(lastDoc));

      const q = query(collection(db, "activity_log"), ...constraints);
      const querySnapshot = await getDocs(q);

      const newLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      setLogs(prev => loadMore ? [...prev, ...newLogs] : newLogs);
      setLastDoc(newLastDoc);
      setHasMore(newLogs.length === LOGS_PER_PAGE);

    } catch (error) {
      console.error("Ошибка загрузки журнала действий:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      // Загружаем только один раз для наполнения выпадающих списков
      const querySnapshot = await getDocs(collection(db, "activity_log"));
      const users = new Set<string>();
      const types = new Set<string>();
      querySnapshot.forEach(doc => {
        users.add(doc.data().userName);
        types.add(doc.data().entityType);
      });
      setUniqueUsers(Array.from(users));
      setUniqueEntityTypes(Array.from(types));
    };

    fetchFilterOptions();
    fetchLogs();
  }, []);

  const handleFilterChange = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchLogs();
  };

  const getActionTypeBadge = (actionType: LogEntry["actionType"]) => {
    switch (actionType) {
      case "CREATE": return "bg-green-600/80 border-green-600";
      case "UPDATE": return "bg-blue-600/80 border-blue-600";
      case "DELETE": return "bg-red-600/80 border-red-600";
      case "LOGIN": return "bg-sky-500/80 border-sky-500";
      case "LOGOUT": return "bg-zinc-500/80 border-zinc-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 w-full bg-zinc-700" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-zinc-900/50 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? format(filters.dateFrom, "dd.MM.yyyy") : <span>Дата от</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.dateFrom || undefined} onSelect={(d) => handleFilterChange("dateFrom", d || null)} initialFocus /></PopoverContent>
          </Popover>
          {/* Date To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? format(filters.dateTo, "dd.MM.yyyy") : <span>Дата до</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.dateTo || undefined} onSelect={(d) => handleFilterChange("dateTo", d || null)} initialFocus /></PopoverContent>
          </Popover>
          {/* User Select */}
          <Select value={filters.user} onValueChange={(v) => handleFilterChange("user", v)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue placeholder="Пользователь" /></SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="all">Все пользователи</SelectItem>
              {uniqueUsers.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
          {/* Entity Type Select */}
          <Select value={filters.entityType} onValueChange={(v) => handleFilterChange("entityType", v)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue placeholder="Сущность" /></SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="all">Все сущности</SelectItem>
              {uniqueEntityTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleApplyFilters} className="w-full" disabled={isLoading}>
          {isLoading ? 'Применение...' : 'Применить фильтры'}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 w-full bg-zinc-700" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="p-4 text-center text-zinc-400">Записи не найдены.</div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {logs.map((log) => (
            <AccordionItem key={log.id} value={log.id} className="bg-zinc-800/50 rounded-lg border-none px-4">
              <AccordionTrigger className="text-left hover:no-underline py-3">
                <div className="flex justify-between items-start w-full">
                  <div className="flex-grow">
                    <p className="font-semibold text-white">{log.userName}</p>
                    <p className="text-zinc-300 text-sm">{log.description}</p>
                     <p className="text-xs text-zinc-500 mt-2">
                      {new Date(log.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    <Badge variant="outline" className={getActionTypeBadge(log.actionType)}>
                      {log.actionType}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="text-xs text-zinc-400 bg-black/20 p-3 rounded-md space-y-1 font-mono">
                  <p><strong>Log ID:</strong> {log.id}</p>
                  <p><strong>User ID:</strong> {log.userId}</p>
                  <p><strong>Entity:</strong> {log.entityType}</p>
                  {log.entityId && <p><strong>Entity ID:</strong> {log.entityId}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {hasMore && !isLoading && (
        <div className="flex justify-center">
          <Button onClick={() => fetchLogs(true)} disabled={isFetchingMore} variant="outline">
            {isFetchingMore ? "Загрузка..." : "Загрузить еще"}
          </Button>
        </div>
      )}
    </div>
  );
}