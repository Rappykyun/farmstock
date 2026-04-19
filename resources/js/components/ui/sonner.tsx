import { Toaster as Sonner, type ToasterProps } from "sonner"

import { useAppearance } from "@/hooks/use-appearance"

function Toaster({ ...props }: ToasterProps) {
  const { resolvedAppearance } = useAppearance()

  return <Sonner theme={resolvedAppearance} richColors closeButton {...props} />
}

export { Toaster }
