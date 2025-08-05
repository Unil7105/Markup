"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Loader2,
  FileText,
  FolderOpen,
  RefreshCw,
  Menu,
  X,
  ChevronLeft,
  Home,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

function FileBrowser() {
  const [files, setFiles] = useState([]);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Close sidebar by default on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clear upload status after 5 seconds
  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => {
        setUploadStatus(null);
        setUploadMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const fetchFiles = async () => {
    setFetchingFiles(true);
    try {
      const res = await axios.get(`${BASE_URL}/file`, {
        withCredentials: true,
      });
      setFiles(res.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setFetchingFiles(false);
    }
  };

  const handleFileRead = async (path, index) => {
    setSelectedFile(index);
    setLoading(true);
    setMarkdown("");

    // On mobile, close the sidebar after selecting a file
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    try {
      const res = await axios.get(`${BASE_URL}/md?path=${path}`, {
        withCredentials: true,
      });
      setMarkdown(res.data.data);
    } catch (err) {
      console.error("Error reading file:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", selectedFile); // This is the file itself
      formData.append("filename", selectedFile.name); // This is the filename as a string
      
      // Send the formData object directly
      const response = await axios.post(
        `${BASE_URL}/upload`,
        formData, // Use the formData object here, not a new object
        {
          headers: {
            "Content-Type": "multipart/form-data", // This header is actually set automatically when using FormData
          },
          withCredentials: true,
        }
      );
  
      setUploadStatus("success");
      setUploadMessage("File uploaded successfully!");
      
      // Refresh the file list after successful upload
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      setUploadMessage(
        error.response?.data?.message || "Failed to upload file"
      );
    } finally {
      setUploadLoading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] dark">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#30363d] px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="mr-1 text-[#c9d1d9] hover:bg-[#30363d]"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center">
              <div className="bg-[#58a6ff] p-1.5 rounded-md mr-2">
                <Home className="h-4 w-4 text-[#0d1117]" />
              </div>
              <h1 className="text-xl font-semibold text-[#c9d1d9] truncate">
                Markdown Explorer
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchFiles}
              variant="outline"
              className="flex items-center gap-2 text-sm border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] transition-colors"
              disabled={fetchingFiles}
            >
              {fetchingFiles ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Fetch Files</span>
              <span className="sm:hidden">Fetch</span>
            </Button>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".md, .markdown, .txt"
                onChange={handleFileChange}
                disabled={uploadLoading}
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] transition-colors"
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Upload File</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Status Notification */}
      {uploadStatus && (
        <div
          className={`px-4 py-2 text-sm ${
            uploadStatus === "success"
              ? "bg-[#0d4429] text-[#3fb950]"
              : "bg-[#5a1e1e] text-[#f85149]"
          } flex items-center justify-center`}
        >
          {uploadStatus === "success" ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-2" />
          )}
          {uploadMessage}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 absolute md:relative z-20 md:translate-x-0 w-full max-w-[280px] border-r border-[#30363d] bg-[#0d1117] h-full flex flex-col`}
        >
          <div className="p-3 border-b border-[#30363d] bg-[#161b22]">
            <h2 className="text-sm font-medium text-[#8b949e] px-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Files
            </h2>
          </div>

          {/* Files list with fixed height and scrolling */}
          <div className="flex-1 overflow-auto custom-scrollbar text-wrap">
            {fetchingFiles ? (
              <div className="p-4 space-y-3 text-wrap">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-12 w-full rounded-md bg-[#21262d]"
                  />
                ))}
              </div>
            ) : files.length > 0 ? (
              <div className="p-3">
                {files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => handleFileRead(file.path, index)}
                    className="w-full text-left mb-1.5 focus:outline-none focus:ring-1 focus:ring-[#58a6ff] rounded-md text-wrap"
                  >
                    <div
                      className={`flex items-center p-2.5 rounded-md transition-all ${
                        selectedFile === index
                          ? "bg-[#1f6feb33] text-[#58a6ff] border-[#388bfd99] border shadow-sm"
                          : "hover:bg-[#21262d] text-[#c9d1d9]"
                      }`}
                    >
                      <FileText
                        className={`h-5 w-5 mr-3 flex-shrink-0 ${
                          selectedFile === index
                            ? "text-[#58a6ff]"
                            : "text-[#8b949e]"
                        }`}
                      />
                      <span className="font-medium truncate text-sm">
                        {file.fileName || `File ${index + 1}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 p-4 text-[#8b949e] text-wrap">
                <FolderOpen className="h-14 w-14 text-[#30363d] mb-4" />
                <p className="text-center font-medium">No files available</p>
                <p className="text-center text-sm mt-1 text-[#6e7681]">
                  Click "Fetch Files" to load your markdown files
                </p>
                <Button
                  onClick={fetchFiles}
                  variant="outline"
                  className="mt-4 bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9]"
                  disabled={fetchingFiles}
                >
                  {fetchingFiles ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Fetch Files
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content area */}
        <div className="flex-1 flex flex-col relative bg-[#0d1117]">
          {selectedFile !== null && (
            <div className="p-3 border-b border-[#30363d] bg-[#161b22] flex items-center sticky top-0 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 md:hidden text-[#c9d1d9] hover:bg-[#30363d]"
                onClick={() => setSidebarOpen(true)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center overflow-hidden">
                <FileText className="h-4 w-4 text-[#58a6ff] mr-2 flex-shrink-0" />
                <h2 className="text-sm font-medium text-[#c9d1d9] truncate">
                  {files[selectedFile]?.fileName || "Content Preview"}
                </h2>
              </div>
            </div>
          )}

          {/* Content container with improved scrolling and padding for mobile */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="py-4 px-3 md:px-6 md:py-6 max-w-3xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-60">
                  <Loader2 className="h-10 w-10 text-[#58a6ff] animate-spin mb-4" />
                  <p className="text-[#8b949e] animate-pulse">
                    Loading content...
                  </p>
                </div>
              ) : markdown ? (
                <div className="markdown-body github-markdown-dark w-full mx-0 pb-12 break-words whitespace-normal">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              padding: "1em",
                              borderRadius: "8px",
                              background: "#161b22",
                              fontSize: "0.85rem",
                              maxWidth: "100%",
                              overflowX: "auto",
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-60 text-[#8b949e]">
                  <FileText className="h-16 w-16 text-[#30363d] mb-4" />
                  <p className="text-lg font-medium text-center">
                    Select a file to view its content
                  </p>
                  <p className="text-sm mt-2 text-[#6e7681] text-center">
                    Your markdown content will be displayed here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true" global="true">
{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #30363d;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #388bfd99;
        }

        .github-markdown-dark {
          color: #c9d1d9;
          background-color: #0d1117;
          font-size: 15px;
          line-height: 1.6;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
          max-width: 100%;
        }

        .github-markdown-dark pre {
          background-color: #161b22 !important;
          border: 1px solid #30363d !important;
          border-radius: 6px;
          padding: 16px;
          overflow-x: auto;
          margin-bottom: 1em;
          max-width: 100%;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .github-markdown-dark code {
          background-color: #21262d !important;
          border-radius: 4px;
          padding: 0.2em 0.4em;
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
            Liberation Mono, monospace;
          font-size: 90%;
          word-break: break-all;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .github-markdown-dark a {
          color: #58a6ff !important;
          text-decoration: none;
        }

        .github-markdown-dark a:hover {
          text-decoration: underline;
        }

        .github-markdown-dark h1,
        .github-markdown-dark h2,
        .github-markdown-dark h3,
        .github-markdown-dark h4 {
          color: #c9d1d9 !important;
          border-bottom: 1px solid #30363d;
          padding-bottom: 0.3em;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .github-markdown-dark h1 {
          font-size: 2em;
        }

        .github-markdown-dark h2 {
          font-size: 1.5em;
        }

        .github-markdown-dark h3 {
          font-size: 1.25em;
        }

        .github-markdown-dark h4 {
          font-size: 1em;
        }

        .github-markdown-dark p,
        .github-markdown-dark ul,
        .github-markdown-dark ol {
          margin-bottom: 1em;
        }

        .github-markdown-dark img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1em 0;
        }

        .github-markdown-dark blockquote {
          border-left: 3px solid #30363d;
          padding-left: 1em;
          color: #8b949e;
          margin: 1em 0;
        }

        .github-markdown-dark table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
          display: block;
          overflow-x: auto;
        }

        .github-markdown-dark table th,
        .github-markdown-dark table td {
          border: 1px solid #30363d;
          padding: 8px 12px;
        }

        .github-markdown-dark table th {
          background-color: #161b22;
        }

        /* Ensure content is readable on mobile */
        @media screen and (max-width: 640px) {
          .github-markdown-dark {
            font-size: 14px;
          }

          .github-markdown-dark h1 {
            font-size: 1.6em;
          }

          .github-markdown-dark h2 {
            font-size: 1.4em;
          }

          .github-markdown-dark h3 {
            font-size: 1.2em;
          }

          .github-markdown-dark pre {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default FileBrowser;
