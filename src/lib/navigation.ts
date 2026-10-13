import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusinessIcon,
  GraduationCapIcon,
  RepeatIcon,
  SunIcon,
  WalletIcon,
} from "lucide-react";

export type NavModule = {
  /** Etiqueta visible, siempre en español. */
  label: string;
  href: string;
  icon: LucideIcon;
  /** Los módulos no disponibles se muestran en gris con la marca "pronto". */
  isEnabled: boolean;
};

/** Módulos de la barra lateral, en orden de aparición. */
export const NAV_MODULES: readonly NavModule[] = [
  { label: "Hoy", href: "/hoy", icon: SunIcon, isEnabled: true },
  {
    label: "Trabajo",
    href: "/trabajo",
    icon: BriefcaseBusinessIcon,
    isEnabled: true,
  },
  {
    label: "Aprendizaje",
    href: "/aprendizaje",
    icon: GraduationCapIcon,
    isEnabled: false,
  },
  { label: "Hábitos", href: "/habitos", icon: RepeatIcon, isEnabled: false },
  { label: "Finanzas", href: "/finanzas", icon: WalletIcon, isEnabled: false },
];
