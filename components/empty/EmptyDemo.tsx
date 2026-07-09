import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface Props {
    title: string;
    description: string;
    createButtonText: string;
    importButtonText: string;
    createButton?: React.ReactNode;
    importButton?: React.ReactNode;
}

export function EmptyDemo({...rest }: Props) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>{rest.title}</EmptyTitle>
        <EmptyDescription>
          {rest.description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          {rest.createButton || <Button variant="secondary">{rest.createButtonText}</Button>}
          {rest.importButton || <Button variant="outline">{rest.importButtonText}</Button>}
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}
