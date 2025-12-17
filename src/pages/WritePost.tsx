import { useCallback, useEffect, useRef, useState } from "react";
import { createBlogPost, fetchBlogPost, updateBlogPost } from "@/api/blogpost";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Code,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo,
  Sparkles,
  Strikethrough,
  Table2,
  Type,
  Underline,
  Undo,
} from "lucide-react";

interface BannerPreview {
  file?: File | null;
  url: string;
}

const defaultContent = `<h2 style="margin-bottom:8px;">Lead with a compelling hypothesis</h2><p style="margin-bottom:16px;">Use this collaborative editor to shape long-form research narratives, document breakthroughs, and share repeatable frameworks with the community. Highlight foundational insights, reference data sources, and clearly state experiment outcomes.</p><ul style="padding-left:20px; margin-bottom:16px;"><li>Introduce the challenge your research addresses.</li><li>Summarize methodology and tooling.</li><li>Call out key results and future exploration.</li></ul>`;

const categories = [
  "Artificial Intelligence",
  "Blockchain",
  "Data Science",
  "Human Computer Interaction",
  "Emerging Tech",
];

const fontFamilies = ["Inter", "Lora", "IBM Plex Mono", "Playfair Display", "Fira Sans"];

const WritePost = () => {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);

  const [banner, setBanner] = useState<BannerPreview | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>(["Innovation", "R&D"]);
  const [tagInput, setTagInput] = useState("");
  const [editorHtml, setEditorHtml] = useState(defaultContent);
  const [isFetchingPost, setIsFetchingPost] = useState(false);
  const [fontFamily, setFontFamily] = useState(fontFamilies[0]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { id } = useParams();
  const editingId = id ? id : null;

  const revokeBannerUrl = useCallback((value: BannerPreview | null) => {
    if (value?.url) {
      URL.revokeObjectURL(value.url);
    }
  }, []);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const syncEditorState = () => {
    const node = editorRef.current;
    if (node) {
      setEditorHtml(node.innerHTML);
    }
  };

  const handleCommand = (command: string, value?: string) => {
    focusEditor();
    document.execCommand(command, false, value);
    syncEditorState();
  };

  const handleHighlight = (value: string) => {
    focusEditor();
    document.execCommand("hiliteColor", false, value);
    document.execCommand("backColor", false, value);
    syncEditorState();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Paste the URL to link:");
    if (!url) return;
    handleCommand("createLink", url.startsWith("http") ? url : `https://${url}`);
  };

  const handleInsertTable = () => {
    focusEditor();
    const tableHtml =
      '<table style="width:100%; border-collapse:collapse; margin:16px 0;">' +
      '<thead><tr style="background:#f5f5f5;"><th style="border:1px solid #d4d4d4; padding:8px; text-align:left;">Parameter</th><th style="border:1px solid #d4d4d4; padding:8px; text-align:left;">Value</th></tr></thead>' +
      '<tbody><tr><td style="border:1px solid #d4d4d4; padding:8px;">Sample Size</td><td style="border:1px solid #d4d4d4; padding:8px;">120 participants</td></tr>' +
      '<tr><td style="border:1px solid #d4d4d4; padding:8px;">Confidence</td><td style="border:1px solid #d4d4d4; padding:8px;">95%</td></tr></tbody></table>';
    document.execCommand("insertHTML", false, tableHtml);
    syncEditorState();
  };

  const handleInlineImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      focusEditor();
      document.execCommand("insertImage", false, String(reader.result));
      syncEditorState();
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    revokeBannerUrl(banner);
    const url = URL.createObjectURL(file);
    setBanner({ file, url });
  };

  const removeBanner = () => {
    revokeBannerUrl(banner);
    setBanner(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  useEffect(
    () => () => {
      revokeBannerUrl(banner);
    },
    [banner, revokeBannerUrl],
  );

  const addTag = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned || tags.includes(cleaned)) return;
    setTags((prev) => [...prev, cleaned]);
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
    if (event.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value));
  };

  const toolbarActions = [
    { icon: Bold, label: "Bold", action: () => handleCommand("bold") },
    { icon: Italic, label: "Italic", action: () => handleCommand("italic") },
    { icon: Underline, label: "Underline", action: () => handleCommand("underline") },
    { icon: Strikethrough, label: "Strike", action: () => handleCommand("strikeThrough") },
    { icon: Type, label: "Heading", action: () => handleCommand("formatBlock", "H2") },
    { icon: AlignLeft, label: "Align left", action: () => handleCommand("justifyLeft") },
    { icon: AlignCenter, label: "Align center", action: () => handleCommand("justifyCenter") },
    { icon: AlignRight, label: "Align right", action: () => handleCommand("justifyRight") },
    { icon: List, label: "Bullet list", action: () => handleCommand("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", action: () => handleCommand("insertOrderedList") },
    { icon: Quote, label: "Blockquote", action: () => handleCommand("formatBlock", "BLOCKQUOTE") },
    { icon: Code, label: "Code", action: () => handleCommand("formatBlock", "PRE") },
    { icon: Link2, label: "Insert link", action: handleInsertLink },
    { icon: ImagePlus, label: "Insert image", action: () => inlineImageInputRef.current?.click() },
    { icon: Table2, label: "Insert table", action: handleInsertTable },
    { icon: Undo, label: "Undo", action: () => handleCommand("undo") },
    { icon: Redo, label: "Redo", action: () => handleCommand("redo") },
  ];

  const handlePublish = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editingId) {
        await updateBlogPost(editingId, {
          title,
          sub_title: subtitle,
          executive_summary: summary,
          content: editorHtml,
          banner_image: banner?.file || null,
          category,
          tags,
          allow_comments: allowComments,
          schedule_date: scheduleDate,
          schedule_time: scheduleTime,
          status: "pending",
        });
      } else {
        await createBlogPost({
          title,
          sub_title: subtitle,
          executive_summary: summary,
          content: editorHtml,
          banner_image: banner?.file || null,
          category,
          tags,
          allow_comments: allowComments,
          schedule_date: scheduleDate,
          schedule_time: scheduleTime,
          status: "pending",
        });
      }
      setSubmitSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setSubmitError("Failed to submit post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
        if (editingId) {
        await updateBlogPost(editingId, {
          title,
          sub_title: subtitle,
          executive_summary: summary,
          content: editorHtml,
          banner_image: banner?.file || null,
          category,
          tags,
          allow_comments: allowComments,
          schedule_date: scheduleDate,
          schedule_time: scheduleTime,
          status: "draft",
        });
      } else {
          await createBlogPost({
            title,
            sub_title: subtitle,
            executive_summary: summary,
            content: editorHtml,
            banner_image: banner?.file || null,
            category,
            tags,
            allow_comments: allowComments,
            schedule_date: scheduleDate,
            schedule_time: scheduleTime,
            status: "draft",
          });
      }
      setSubmitSuccess(true);
      toast?.({ title: "Draft saved." });
    } catch (err) {
      setSubmitError("Failed to save draft. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Prevent showing the default content briefly when navigating to edit.
  useEffect(() => {
    if (!editingId) {
      // New post: use default content if editor is empty
      if (!editorHtml) setEditorHtml(defaultContent);
      return;
    }
    let mounted = true;
    setIsFetchingPost(true);
    (async () => {
      try {
        const post = await fetchBlogPost(editingId);
        if (!mounted) return;
        setTitle(post.title || "");
        setSubtitle(post.sub_title || "");
        setCategory(post.category || categories[0]);
        setSummary(post.executive_summary || "");
        setTags((post as any).tags || []);
        setEditorHtml(post.content || "");
        if ((post as any).banner_image) {
          setBanner({ file: null, url: (post as any).banner_image as string });
        }
      } catch (err) {
        // ignore load errors
      } finally {
        setIsFetchingPost(false);
      }
    })();
    return () => { mounted = false; };
  }, [editingId]);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 pb-20 pt-28">
        <Button
          variant="ghost"
          className="mb-4 flex w-fit items-center gap-2 px-0 text-primary hover:text-primary"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Button>
        <header className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Compose Research Article</p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Write a New Insight</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Draft, style, and publish exploratory findings with tooling tailored for research storytelling.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10" onClick={handleSaveDraft} disabled={submitting}>
              {submitting ? "Saving..." : "Save draft"}
            </Button>
            <Button
              className="bg-primary shadow-lg hover:bg-primary/90"
              onClick={handlePublish}
              disabled={submitting || isFetchingPost || !title || !editorHtml}
            >
              {submitting ? "Publishing..." : "Publish article"}
            </Button>
          </div>
          {submitError && (
            <div className="mt-2 text-destructive text-sm">{submitError}</div>
          )}
          {submitSuccess && (
            <div className="mt-2 text-emerald-600 text-sm">Post submitted for review! Redirecting...</div>
          )}
        </header>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle>Banner Media</CardTitle>
                <CardDescription>Upload a bold visual that anchors your narrative.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-6 text-sm text-muted-foreground">
                  {banner ? (
                    <div className="space-y-3">
                      <img src={banner.url} alt="Selected banner" className="h-60 w-full rounded-lg object-cover" />
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => bannerInputRef.current?.click()}>
                          Replace banner
                        </Button>
                        <Button variant="ghost" onClick={removeBanner}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                      <Sparkles className="h-10 w-10 text-primary" />
                      <div>
                        <p className="text-base font-semibold text-foreground">Upload a banner image</p>
                        <p>Recommended ratio 16:9 · Minimum width 1600px</p>
                      </div>
                      <Button onClick={() => bannerInputRef.current?.click()}>Choose file</Button>
                    </div>
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>Set the structure and metadata before publishing.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Eg. Mapping ethical guardrails for generative AI deployments"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Add a short, compelling summary"
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((entry) => (
                        <SelectItem key={entry} value={entry}>
                          {entry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary">Executive Summary</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    placeholder="Capture the key outcome, breakthroughs, and what readers should do next."
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <span className="text-primary/80">×</span>
                      </button>
                    ))}
                    <input
                      className="flex-1 border-none bg-transparent text-sm outline-none"
                      placeholder="Add tag and press enter"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle>Manuscript Editor</CardTitle>
                <CardDescription>Format with semantic controls tuned for research-grade publishing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-muted/50 p-3">
                  {toolbarActions.map(({ icon: Icon, label, action }) => (
                    <Button key={label} variant="ghost" size="icon" className="h-9 w-9" onClick={action}>
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{label}</span>
                    </Button>
                  ))}
                  <Separator />
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs">
                    <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="color"
                      aria-label="Select text color"
                      onChange={(event) => handleCommand("foreColor", event.target.value)}
                      className="h-6 w-6 cursor-pointer border-none bg-transparent p-0"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs">
                    <Highlighter className="h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="color"
                      aria-label="Select highlight color"
                      onChange={(event) => handleHighlight(event.target.value)}
                      className="h-6 w-6 cursor-pointer border-none bg-transparent p-0"
                    />
                  </div>
                  <Select value={fontFamily} onValueChange={(value) => {
                    setFontFamily(value);
                    handleCommand("fontName", value);
                  }}>
                    <SelectTrigger className="w-44 gap-2">
                      <Type className="h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    ref={inlineImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInlineImage}
                  />
                </div>

                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="write">
                    <div className="min-h-[400px] rounded-lg border border-input bg-background p-6 shadow-sm" role="textbox">
                                {isFetchingPost ? (
                                  <div className="flex h-96 items-center justify-center">
                                    <div className="text-sm text-muted-foreground">Loading post...</div>
                                  </div>
                                ) : (
                                  <div
                                    ref={editorRef}
                                    className="prose max-w-none text-base leading-relaxed text-foreground focus:outline-none"
                                    contentEditable
                                    suppressContentEditableWarning
                                    dangerouslySetInnerHTML={{ __html: editorHtml }}
                                    onInput={syncEditorState}
                                  />
                                )}
                    </div>
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="space-y-4 rounded-lg border border-input bg-background p-6 shadow-sm">
                      {banner && (
                        <img src={banner.url} alt="Preview banner" className="h-60 w-full rounded-lg object-cover" />
                      )}
                      <article className="prose max-w-none">
                        {title && <h1>{title}</h1>}
                        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
                        <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
                      </article>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
                <CardDescription>Control release, collaboration, and visibility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule-date">Schedule date</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(event) => setScheduleDate(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule-time">Schedule time</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(event) => setScheduleTime(event.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Allow threaded comments</p>
                    <p className="text-xs text-muted-foreground">Encourage peers to contribute additional findings.</p>
                  </div>
                  <Switch checked={allowComments} onCheckedChange={(checked) => setAllowComments(Boolean(checked))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary-preview">SEO synopsis</Label>
                  <Textarea
                    id="summary-preview"
                    rows={3}
                    placeholder="Short description displayed in search and social previews."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle>Submission Checklist</CardTitle>
                <CardDescription>Quality gates before routing to reviewers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Abstract summarises hypothesis, methodology, and impact.</p>
                <p>• Figures and tables reference their original data sources.</p>
                <p>• Ethical compliance statement present where required.</p>
                <p>• All acronyms expanded on first use.</p>
                <p>
                  • Provide contact details for collaboration invites by completing the <Link to="/dashboard" className="text-primary underline">profile section</Link>.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

const Separator = () => <div className="h-6 w-px bg-border/80" />;

export default WritePost;
