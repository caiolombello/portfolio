"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { defaultMetadata, type SiteMetadata } from "@/types/metadata";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { CmsMetadata } from "@/types/cms";
import { Metadata as NextMetadata } from "next";

interface RobotsMetadata {
  index: boolean;
  follow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  noimageindex: boolean;
  notranslate: boolean;
  googleBot: {
    index: boolean;
    follow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    noimageindex: boolean;
    notranslate: boolean;
    maxSnippet: number;
    maxImagePreview: string;
    maxVideoPreview: number;
  };
}

interface VerificationMetadata {
  google: string;
  bing: string;
  yandex: string;
  other: Record<string, string>;
}

interface Metadata {
  title: string;
  description: string;
  robots: RobotsMetadata;
  verification: VerificationMetadata;
}

interface MetadataValue {
  value: string | number | boolean | Record<string, unknown>;
  checked?: boolean;
}

export default function AdminMetadata() {
  const { t } = useLanguage();
  const [metadata, setMetadata] = useState<SiteMetadata>(defaultMetadata);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/metadata");
        if (response.ok) {
          const data = await response.json();
          setMetadata(data);
        } else {
          console.error(
            "Erro na resposta da API:",
            response.status,
            response.statusText,
          );
          setMetadata(defaultMetadata);
          toast({
            title: "Aviso",
            description:
              "Usando configurações padrão de SEO. Você pode personalizá-las e salvar.",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar metadados:", error);
        setMetadata(defaultMetadata);
        toast({
          title: "Aviso",
          description:
            "Usando configurações padrão de SEO. Você pode personalizá-las e salvar.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMetadata();
    }
  }, [toast, isAuthenticated]);

  const validateMetadata = (): boolean => {
    const errors: Record<string, string> = {};

    if (!metadata.title.default.trim()) {
      errors["title.default"] = "O título padrão é obrigatório";
    }

    if (!metadata.title.template.trim()) {
      errors["title.template"] = "O template de título é obrigatório";
    }

    if (!metadata.description.trim()) {
      errors["description"] = "A descrição é obrigatória";
    }

    if (!metadata.openGraph.siteName.trim()) {
      errors["openGraph.siteName"] = "O nome do site é obrigatório";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNestedChange = (
    path: string[],
    value: string | boolean | number | object | ((prev: Metadata) => Metadata)
  ) => {
    setMetadata((prev) => {
      const newMetadata = { ...prev };
      let current: Record<string, unknown> = newMetadata;

      if (typeof value === 'function') {
        const lastKey = path[path.length - 1];
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]] as Record<string, unknown>;
        }
        current[lastKey] = value(current[lastKey] as Metadata);
        return newMetadata;
      }

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      return newMetadata;
    });

    setSaveSuccess(false);
    setSaveError(null);
    setValidationErrors({});
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    handleNestedChange(["keywords"], keywords);
  };

  const handleAuthorsChange = (value: string) => {
    const authors = value
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);
    handleNestedChange(["authors"], authors.map((name) => ({ name })));
  };

  const handleRobotsChange = (key: keyof RobotsMetadata, checked: boolean) => {
    handleNestedChange(["robots", key], checked);
  };

  const handleGoogleBotChange = (
    key: keyof RobotsMetadata["googleBot"],
    value: boolean | number | string,
  ) => {
    handleNestedChange(["robots", "googleBot", key], value);
  };

  const handleVerificationChange = (field: string, value: string) => {
    handleNestedChange(["verification", field], value);
  };

  const handleAddVerification = () => {
    const name = prompt("Digite o nome da verificação:");
    if (!name) return;

    const value = prompt(`Digite o valor para a verificação "${name}":`);
    if (value === null) return;

    handleNestedChange(["verification", "other", name], value);
  };

  const handleRemoveVerification = (name: string) => {
    handleNestedChange(["verification", "other"], (prev: Record<string, string>) => {
      const newOther = { ...prev };
      delete newOther[name];
      return newOther;
    });
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Tem certeza que deseja redefinir todos os metadados para os valores padrão? Esta ação não pode ser desfeita.",
      )
    ) {
      setMetadata(defaultMetadata);
      setSaveSuccess(false);
      setSaveError(null);
      setValidationErrors({});
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(metadata, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metadata.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setMetadata(data);
        setSaveSuccess(false);
        setSaveError(null);
        setValidationErrors({});
        toast({
          title: "Sucesso",
          description: "Configurações importadas com sucesso",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Arquivo inválido",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateMetadata()) {
      toast({
        title: "Erro",
        description: "Por favor, corrija os erros antes de salvar",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const response = await fetch("/api/admin/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSaveSuccess(true);
        toast({
          title: "Sucesso",
          description: "Metadados atualizados com sucesso",
        });
      } else {
        const errorMessage =
          data.error || "Não foi possível atualizar os metadados";
        setSaveError(errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar metadados:", error);
      setSaveError("Erro de conexão ao tentar salvar os metadados");
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os metadados",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">
          {t("admin.metadata.seoTitle")}
        </h1>
        <div className="flex gap-2">
          <Button
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
            )}
            asChild
          >
            <DialogTrigger>
              <EyeIcon className="mr-2 h-4 w-4" />
              {t("admin.metadata.preview")}
            </DialogTrigger>
          </Button>

          <Button
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
            )}
            onClick={handleExport}
          >
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            {t("admin.metadata.export")}
          </Button>

          <div className="flex items-center space-x-2">
            <button
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json";
                input.onchange = (e) =>
                  handleImport(
                    e as unknown as React.ChangeEvent<HTMLInputElement>,
                  );
                input.click();
              }}
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              {t("admin.metadata.import")}
            </button>
          </div>

          <Button
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
            )}
            onClick={handleResetToDefaults}
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            {t("admin.metadata.reset")}
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <Alert
          className="mb-6 bg-green-50 border-green-200"
          role="alert"
          aria-live="polite"
        >
          <AlertTitle className="text-green-800">
            {t("admin.metadata.saved")}
          </AlertTitle>
          <AlertDescription className="text-green-700">
            {t("admin.metadata.savedDesc")}
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert
          variant="destructive"
          className="mb-6"
          role="alert"
          aria-live="assertive"
        >
          <AlertTitle>{t("admin.metadata.saveError")}</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              {t("admin.metadata.tabGeneral")}
            </TabsTrigger>
            <TabsTrigger value="robots">
              {t("admin.metadata.tabRobots")}
            </TabsTrigger>
            <TabsTrigger value="verification">
              {t("admin.metadata.tabVerification")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.metadata.generalInfo")}</CardTitle>
                <CardDescription>
                  {t("admin.metadata.generalDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title-default">
                      {t("admin.metadata.defaultTitle")}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.title.default.length}/60{" "}
                      {t("admin.metadata.chars")}
                    </span>
                  </div>
                  <Input
                    id="title-default"
                    value={metadata.title.default}
                    onChange={(e) =>
                      handleNestedChange(["title", "default"], e.target.value)
                    }
                    required
                    aria-required="true"
                    aria-invalid={!!validationErrors["title.default"]}
                    className={
                      validationErrors["title.default"] ? "border-red-500" : ""
                    }
                  />
                  {validationErrors["title.default"] && (
                    <p
                      className="text-xs text-red-500"
                      role="alert"
                      aria-live="assertive"
                    >
                      {validationErrors["title.default"]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {t("admin.metadata.defaultTitleDesc")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title-template">
                      {t("admin.metadata.titleTemplate")}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.title.template.length}/100{" "}
                      {t("admin.metadata.chars")}
                    </span>
                  </div>
                  <Input
                    id="title-template"
                    value={metadata.title.template}
                    onChange={(e) =>
                      handleNestedChange(["title", "template"], e.target.value)
                    }
                    required
                    aria-required="true"
                    aria-invalid={!!validationErrors["title.template"]}
                    className={
                      validationErrors["title.template"] ? "border-red-500" : ""
                    }
                  />
                  {validationErrors["title.template"] && (
                    <p
                      className="text-xs text-red-500"
                      role="alert"
                      aria-live="assertive"
                    >
                      {validationErrors["title.template"]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {t("admin.metadata.titleTemplateDesc")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">
                      {t("admin.metadata.description")}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.description.length}/160{" "}
                      {t("admin.metadata.chars")}
                    </span>
                  </div>
                  <Textarea
                    id="description"
                    value={metadata.description}
                    onChange={(e) =>
                      handleNestedChange(["description"], e.target.value)
                    }
                    required
                    aria-required="true"
                    aria-invalid={!!validationErrors["description"]}
                    className={
                      validationErrors["description"] ? "border-red-500" : ""
                    }
                  />
                  {validationErrors["description"] && (
                    <p
                      className="text-xs text-red-500"
                      role="alert"
                      aria-live="assertive"
                    >
                      {validationErrors["description"]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {t("admin.metadata.descriptionDesc")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">
                    {t("admin.metadata.keywords")}
                  </Label>
                  <Textarea
                    id="keywords"
                    value={metadata.keywords.join(", ")}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("admin.metadata.keywordsDesc")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authors">{t("admin.metadata.authors")}</Label>
                  <Input
                    id="authors"
                    value={metadata.authors[0]?.name || ""}
                    onChange={(e) => handleAuthorsChange(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creator">
                      {t("admin.metadata.creator")}
                    </Label>
                    <Input
                      id="creator"
                      value={metadata.creator}
                      onChange={(e) => handleNestedChange(["creator"], e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher">
                      {t("admin.metadata.publisher")}
                    </Label>
                    <Input
                      id="publisher"
                      value={metadata.publisher}
                      onChange={(e) => handleNestedChange(["publisher"], e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="robots">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.metadata.robotsTitle")}</CardTitle>
                <CardDescription>
                  {t("admin.metadata.robotsDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="robots-index" className="text-base">
                        {t("admin.metadata.index")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("admin.metadata.indexDesc")}
                      </p>
                    </div>
                    <Switch
                      id="robots-index"
                      checked={metadata.robots.index}
                      onCheckedChange={(checked: boolean) =>
                        handleRobotsChange("index", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="robots-follow" className="text-base">
                        {t("admin.metadata.follow")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("admin.metadata.followDesc")}
                      </p>
                    </div>
                    <Switch
                      id="robots-follow"
                      checked={metadata.robots.follow}
                      onCheckedChange={(checked: boolean) =>
                        handleRobotsChange("follow", checked)
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    {t("admin.metadata.googleBotTitle")}
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="googlebot-index" className="text-base">
                          {t("admin.metadata.index")}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {t("admin.metadata.indexDesc")}
                        </p>
                      </div>
                      <Switch
                        id="googlebot-index"
                        checked={metadata.robots.googleBot?.index ?? false}
                        onCheckedChange={(checked: boolean) =>
                          handleGoogleBotChange("index", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="googlebot-follow" className="text-base">
                          {t("admin.metadata.follow")}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {t("admin.metadata.followDesc")}
                        </p>
                      </div>
                      <Switch
                        id="googlebot-follow"
                        checked={metadata.robots.googleBot?.follow ?? false}
                        onCheckedChange={(checked: boolean) =>
                          handleGoogleBotChange("follow", checked)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="googlebot-maxVideoPreview">
                        {t("admin.metadata.maxVideoPreview")}
                      </Label>
                      <Input
                        id="googlebot-maxVideoPreview"
                        type="number"
                        value={metadata.robots.googleBot?.maxVideoPreview ?? -1}
                        onChange={(e) =>
                          handleGoogleBotChange(
                            "maxVideoPreview",
                            Number.parseInt(e.target.value),
                          )
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        -1 para sem limite, ou um número positivo para limitar o
                        tamanho em segundos
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="googlebot-maxImagePreview">
                        {t("admin.metadata.maxImagePreview")}
                      </Label>
                      <select
                        id="googlebot-maxImagePreview"
                        value={metadata.robots.googleBot?.maxImagePreview ?? "none"}
                        onChange={(e) =>
                          handleGoogleBotChange(
                            "maxImagePreview",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="none">{t("admin.metadata.none")}</option>
                        <option value="standard">
                          {t("admin.metadata.standard")}
                        </option>
                        <option value="large">
                          {t("admin.metadata.large")}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="googlebot-maxSnippet">
                        {t("admin.metadata.maxSnippet")}
                      </Label>
                      <Input
                        id="googlebot-maxSnippet"
                        type="number"
                        value={metadata.robots.googleBot?.maxSnippet ?? -1}
                        onChange={(e) =>
                          handleGoogleBotChange(
                            "maxSnippet",
                            Number.parseInt(e.target.value),
                          )
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        -1 para sem limite, ou um número positivo para limitar o
                        tamanho em caracteres
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.metadata.verificationTitle")}</CardTitle>
                <CardDescription>
                  {t("admin.metadata.verificationDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-google">
                    {t("admin.metadata.googleVerification")}
                  </Label>
                  <Input
                    id="verification-google"
                    value={metadata.verification.google}
                    onChange={(e) =>
                      handleVerificationChange("google", e.target.value)
                    }
                    placeholder={t("admin.metadata.googlePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-yandex">
                    {t("admin.metadata.yandexVerification")}
                  </Label>
                  <Input
                    id="verification-yandex"
                    value={metadata.verification.yandex}
                    onChange={(e) =>
                      handleVerificationChange("yandex", e.target.value)
                    }
                    placeholder={t("admin.metadata.yandexPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-yahoo">
                    {t("admin.metadata.yahooVerification")}
                  </Label>
                  <Input
                    id="verification-yahoo"
                    value={metadata.verification.yahoo}
                    onChange={(e) =>
                      handleVerificationChange("yahoo", e.target.value)
                    }
                    placeholder={t("admin.metadata.yahooPlaceholder")}
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {t("admin.metadata.otherVerification")}
                    </h3>
                    <Button
                      className={cn(
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3",
                      )}
                      onClick={handleAddVerification}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {t("admin.metadata.addVerification")}
                    </Button>
                  </div>

                  {Object.keys(metadata.verification.other).length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("admin.metadata.noOtherVerification")}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(metadata.verification.other).map(
                        ([name, value]) => (
                          <div key={name} className="flex items-center gap-2">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <Input value={name} disabled />
                              <Input
                                value={value}
                                onChange={(e) => {
                                  handleNestedChange(["verification", "other", name], e.target.value);
                                }}
                              />
                            </div>
                            <Button
                              className={cn(
                                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-destructive hover:text-destructive/90 hover:bg-destructive/10",
                              )}
                              onClick={() => handleRemoveVerification(name)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                {t("admin.metadata.saving")}
              </>
            ) : (
              t("admin.metadata.save")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
