import React, { useState } from 'react';
import Header from '../components/Header';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const stageOptions = [
  "Idea",
  "Development",
  "Beta",
  "Live",
  "Scaling"
] as const;

const fundingOptions = [
  "Bootstrapped",
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B+",
  "Public"
] as const;

const formSchema = z.object({
  // Basic Project Information
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  oneLiner: z.string().max(60, {
    message: "One liner must not exceed 60 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  subCategory: z.string().optional(),
  
  // Visual Assets
  logo: z.any().optional(),
  bannerImage: z.any().optional(),
  screenshotImages: z.any().optional(),
  demoVideo: z.string().url().optional().or(z.string().length(0)),
  
  // Project Description
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  keyFeatures: z.string(),
  uniqueValue: z.string(),
  targetAudience: z.string(),
  
  // Technical Details
  solanaAddress: z.string().min(1, {
    message: "Solana program address is required.",
  }),
  githubRepo: z.string().url().optional().or(z.string().length(0)),
  liveUrl: z.string().url({
    message: "Please enter a valid URL."
  }),
  testnetUrl: z.string().url().optional().or(z.string().length(0)),
  auditStatus: z.string().optional(),
  
  // Tokenomics & Economics
  tokenSymbol: z.string().optional(),
  tokenAddress: z.string().optional(),
  tvl: z.string().optional(),
  revenueModel: z.string().optional(),
  tokenDistribution: z.string().optional(),
  
  // Team & Community
  founders: z.string().optional(),
  teamSize: z.string().optional(),
  twitter: z.string().min(1, {
    message: "Twitter handle is required.",
  }),
  discord: z.string().url().optional().or(z.string().length(0)),
  telegram: z.string().url().optional().or(z.string().length(0)),
  blog: z.string().url().optional().or(z.string().length(0)),
  
  // Launch Strategy
  launchDate: z.string().min(1, {
    message: "Launch date is required.",
  }),
  currentStage: z.enum(stageOptions).optional(),
  fundingStatus: z.enum(fundingOptions).optional(),
  achievements: z.string().optional(),
  
  // DAO Integration
  daoCompatibility: z.string().optional(),
  governanceToken: z.string().optional(),
  investmentOpportunity: z.string().optional(),
  minimumInvestment: z.string().optional(),
  roiTimeline: z.string().optional(),
  
  // Metrics & Traction
  dailyActiveUsers: z.string().optional(),
  monthlyVolume: z.string().optional(),
  totalUsers: z.string().optional(),
  partnerships: z.string().optional(),
  pressCoverage: z.string().optional(),
  
  // Creative Extras
  elevatorPitch: z.any().optional(),
  meme: z.any().optional(),
  easterEgg: z.string().optional(),
  founderStory: z.string().optional(),
  communityFeedback: z.string().optional(),
  
  // Submission Preferences
  preferredLaunchDay: z.string().optional(),
  specialAnnouncements: z.string().optional(),
  collaborationInterests: z.string().optional(),
  
  // Verification
  socialProof: z.string().optional(),
  teamVerification: z.string().optional(),
  projectAuthenticity: z.boolean().default(false),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function Submit() {
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      oneLiner: "",
      category: "",
      subCategory: "",
      logo: undefined,
      bannerImage: undefined,
      screenshotImages: undefined,
      demoVideo: "",
      description: "",
      keyFeatures: "",
      uniqueValue: "",
      targetAudience: "",
      solanaAddress: "",
      githubRepo: "",
      liveUrl: "",
      testnetUrl: "",
      auditStatus: "",
      tokenSymbol: "",
      tokenAddress: "",
      tvl: "",
      revenueModel: "",
      tokenDistribution: "",
      founders: "",
      teamSize: "",
      twitter: "",
      discord: "",
      telegram: "",
      blog: "",
      launchDate: "",
      currentStage: "Development",
      fundingStatus: "Bootstrapped",
      achievements: "",
      daoCompatibility: "",
      governanceToken: "",
      investmentOpportunity: "",
      minimumInvestment: "",
      roiTimeline: "",
      dailyActiveUsers: "",
      monthlyVolume: "",
      totalUsers: "",
      partnerships: "",
      pressCoverage: "",
      elevatorPitch: undefined,
      meme: undefined,
      easterEgg: "",
      founderStory: "",
      communityFeedback: "",
      preferredLaunchDay: "",
      specialAnnouncements: "",
      collaborationInterests: "",
      socialProof: "",
      teamVerification: "",
      projectAuthenticity: false,
    },
  });

  async function onSubmit(values: FormSchemaType) {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit project');
      }

      const result = await response.json();
      
    toast({
      title: "Submission Received!",
      description: "We'll review your project and get back to you soon.",
    });

      // Reset form after successful submission
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isSubmitted) {
  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Submission Received!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your dapp! We'll review it and get back to you within 2-3 business days.
            </p>
            <div className="space-y-3">
              <Link href="/products">
                <Button className="w-full bg-[#FF6154] hover:bg-[#E55347]">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Products
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
                className="w-full"
              >
                Submit Another Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">🚀 Launch Your Dapp on DappHunt</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Submit your dapp to get featured on DappHunt and reach thousands of potential users, investors, and collaborators.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Project Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Basic Project Information
                </h2>
                
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="What's your dapp called?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="oneLiner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One Liner*</FormLabel>
                      <FormControl>
                        <Input placeholder="One catchy sentence describing your dapp (max 60 characters)" {...field} />
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/60 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                            </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-category</FormLabel>
                      <FormControl>
                        <Input placeholder="More specific classification within your main category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Visual Assets */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Visual Assets
                </h2>
                
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Logo*</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormDescription>
                        512x512px minimum, transparent background preferred
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bannerImage"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormDescription>
                        1200x630px for social sharing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="screenshotImages"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Screenshots/Demo Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files ? Array.from(e.target.files) : [];
                            onChange(files);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormDescription>
                        Up to 5 images showing your dapp in action
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="demoVideo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo Video</FormLabel>
                      <FormControl>
                        <Input placeholder="Link to your demo video (YouTube, Vimeo, etc.)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional 30-60 second walkthrough
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Project Description */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Project Description
                </h2>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What problem does your dapp solve? How does it work?"
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="keyFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Features</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List 3-5 main features/benefits"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="uniqueValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What Makes It Special?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your unique value proposition"
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="Who is this dapp designed for?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Technical Details */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Technical Details
                </h2>
                
                <FormField
                  control={form.control}
                  name="solanaAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solana Program Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="Your smart contract address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="githubRepo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Repository</FormLabel>
                      <FormControl>
                        <Input placeholder="Link to your GitHub repository" {...field} />
                      </FormControl>
                      <FormDescription>
                        Open source? Share your code!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live Dapp URL*</FormLabel>
                      <FormControl>
                        <Input placeholder="Where can people try it?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="testnetUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testnet Version</FormLabel>
                      <FormControl>
                        <Input placeholder="Beta/testing link if applicable" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="auditStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audit Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Audited by whom? Link to audit report" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Tokenomics & Economics */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Tokenomics & Economics
                </h2>
                
                <FormField
                  control={form.control}
                  name="tokenSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="If you have a token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tokenAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Contract Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address of your token contract" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tvl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current TVL/Volume</FormLabel>
                      <FormControl>
                        <Input placeholder="Total value locked or transaction volume" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="revenueModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenue Model</FormLabel>
                      <FormControl>
                        <Input placeholder="How do you make money?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tokenDistribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Distribution</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief overview of tokenomics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Team & Community */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Team & Community
                </h2>
                
                <FormField
                  control={form.control}
                  name="founders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founder(s) Name & Background</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Names and brief backgrounds of founders" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size</FormLabel>
                      <FormControl>
                        <Input placeholder="Number of team members" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Handle*</FormLabel>
                      <FormControl>
                        <Input placeholder="@yourproject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord Server</FormLabel>
                      <FormControl>
                        <Input placeholder="Discord invite link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram Channel</FormLabel>
                      <FormControl>
                        <Input placeholder="Telegram group/channel link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="blog"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medium/Blog</FormLabel>
                      <FormControl>
                        <Input placeholder="Content hub URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Launch Strategy */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Launch Strategy
                </h2>
                
                <FormField
                  control={form.control}
                  name="launchDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Launch Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When did you go live or plan to?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your current stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stageOptions.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fundingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select funding status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fundingOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Achievements</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Awards, partnerships, milestones" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button type="submit" className="px-8 py-6 text-lg bg-[#FF6154] hover:bg-[#E55347]">
                  Submit Your Dapp
                </Button>
              </div>
              
              {/* Pro Tips */}
              <div className="bg-[#fef7e6] p-6 rounded-lg border border-amber-200">
                <h3 className="flex items-center text-lg font-semibold text-amber-800 mb-3">
                  <span className="mr-2">💡</span> Pro Tips
                </h3>
                <ul className="space-y-2 text-amber-800">
                  <li>• Submit 2-3 days before your preferred launch date</li>
                  <li>• Engage with the DappHunt community before submitting</li>
                  <li>• Prepare your community to vote on launch day</li>
                  <li>• Have your DAO governance structure ready for potential investments</li>
                </ul>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
