import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { ModeToggle } from "./toggle";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, BarChart, Calendar, ChevronRight, Layout } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyCarousel from "@/components/CompanyCarousel";
import faqs from '@/data/faqs'

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline Your Workflow <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            with {" "} <Image className="h-14 sm:h-24 w-auto object-contain" src={'/logo2.png'} alt="Zscrum Logo" width={400} height={80} />
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto mt-5">
          Empower your team with our intuitive project management solution.
        </p>
        <Link className={buttonVariants({
          size: 'lg',
          className: 'mr-4'
        })} href={`/onboarding`}>
          Get Started
          <ChevronRight className="size-5 ml-1" />
        </Link>

        <Link className={buttonVariants({
          variant: 'outline',
          size: 'lg',
          className: 'mr-4'
        })} href={`#features`}>
          Learn More
          <ChevronRight className="size-5 ml-1" />
        </Link>
      </section>

      <section id="features" className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Key Features
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              return (
                <Card key={index} className='bg-gray-800'>
                  <CardContent className='pt-6'>
                    <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                    <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted by Industry Leaders
          </h3>

          <CompanyCarousel />

        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h3>

          <Accordion type="single" collapsible className='w-full'>
            {faqs.map((faq, index) => {
              return <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            })}
          </Accordion>

        </div>
      </section>

      <section className="py-20 px-5 text-center">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h3>

          <p className="text-muted-foreground text-xl mb-12">
            Join thousands of teams already using ZSCRUM to streamline their projects and boost productivity.
          </p>

          <Link className={buttonVariants({
            size: 'lg',
            className: 'animate-bounce'
          })} href={`/onboarding`}>
            Start for Free <ArrowRight className="size-5 ml-2"/>
          </Link>

        </div>
      </section>

      {/* Hello
      <Button variant='destructive' className='bg-amber-400'>
        Click here
      </Button>
      <ModeToggle /> */}
    </div>
  )
}
