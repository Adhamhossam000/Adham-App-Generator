import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStudio } from "@/providers/studio-provider";
import { Ellipsis } from "lucide-react";

export function OptionsButton({ className }: { className?: string }) {
	const { setIsOverlayOpen, isOverlayOpen } = useStudio();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={cn(className)}>
					<Ellipsis size={16} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => setIsOverlayOpen(!isOverlayOpen)}>
					Show prompt
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
