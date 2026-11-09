import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/pousada/home";

export const Route = createFileRoute("/")({ component: Home });
