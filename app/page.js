import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModeToggle } from "./toggle";

export default function Home() {
  return (
    <div className="text-6xl text-red-500">
      Hello
      <Button variant='destructive' className='bg-amber-400'>
        Click here
      </Button>
      <ModeToggle />
    </div>
  )
}
