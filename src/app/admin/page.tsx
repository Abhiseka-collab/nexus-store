'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  PackagePlus,
  Settings,
  ShoppingBag,
  Database,
  Activity,
  LogOut,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Download,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  FileText,
  LineChart,
  TrendingUp,
  DollarSign,
  Percent,
  Eye,
  Globe,
  Tag,
  Copy,
  Mail,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types/product';
import { SafeImage } from '@/components/SafeImage';

export default function AdminPage() {
  const {
    products,
    settings,
    orders,
    promos,
    logs,
    isAdminAuthenticated,
    lockoutRemainingSeconds,
    currency,
    currencySymbol,
    loginAdmin,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
    addPromoCode,
    deletePromoCode,
    togglePromoCode,
    changeAdminPassword,
    createBackup,
    restoreBackup,
    runSystemDiagnostics,
    clearLogs,
    getAnalytics,
    mergeSyncedOrders,
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'traffic' | 'settings' | 'orders' | 'promos' | 'diagnostics' | 'backups'>('traffic');
  const [trafficTimeframe, setTrafficTimeframe] = useState<'day' | 'week' | 'month'>('week');

  // Gateway Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ message: string; type?: 'error' | 'warning' | 'success' } | null>(null);

  // Orders State
  const [orderSearch, setOrderSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Promo Codes State
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(25);
  const [promoFeedback, setPromoFeedback] = useState<{ message: string; error?: boolean } | null>(null);

  // Quick Announcement State
  const [quickAnnouncement, setQuickAnnouncement] = useState(settings.announcementText);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields for product add/edit
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState(29);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(49);
  const [formCategory, setFormCategory] = useState<Product['category']>('Notion Templates');
  const [formBadge, setFormBadge] = useState<Product['badge']>('New');
  const [formThumbnail, setFormThumbnail] = useState('https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80');
  const [formFormat, setFormFormat] = useState('Notion Template + PDF');
  const [formSize, setFormSize] = useState('15 MB');
  const [formFeatures, setFormFeatures] = useState('Automated workflow pipeline\nStep-by-step video setup\nLifetime updates included');
  const [formFiles, setFormFiles] = useState('Workspace Access Link\nSetup Guide (PDF)');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Diagnostics state
  const [diagnosticsResult, setDiagnosticsResult] = useState<{
    timestamp: string;
    checks: Array<{ name: string; status: 'healthy' | 'warning' | 'issue'; detail: string }>;
  } | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangedMessage, setPasswordChangedMessage] = useState('');

  // Backup restore state
  const [backupFileContent, setBackupFileContent] = useState('');
  const [restoreMessage, setRestoreMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Search filter for products
  const [productSearch, setProductSearch] = useState('');

  // Auto-login if auth parameter is present in URL (e.g. from desktop launcher)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !isAdminAuthenticated && lockoutRemainingSeconds === 0) {
      const params = new URLSearchParams(window.location.search);
      const authKey = params.get('auth');
      if (authKey) {
        loginAdmin(authKey).then((res) => {
          if (res.success) {
            // Clean URL query string so password is not stored in browser history
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        });
      }
    }
  }, [isAdminAuthenticated, lockoutRemainingSeconds, loginAdmin]);

  // Sync real orders directly from Razorpay payment gateway
  const handleSyncOrders = React.useCallback(async (isManual: boolean = false) => {
    setIsSyncing(true);
    if (isManual) {
      setSyncFeedback(null);
    }
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (isManual) {
          setSyncFeedback({
            message: data.error || 'Failed to sync with Razorpay gateway.',
            type: 'error',
          });
        }
      } else {
        if (Array.isArray(data.orders)) {
          mergeSyncedOrders(data.orders);
        }
        if (data.warning) {
          if (isManual) {
            setSyncFeedback({
              message: `Gateway Sync: ${data.warning}`,
              type: 'warning',
            });
          }
        } else if (isManual) {
          setSyncFeedback({
            message:
              data.count > 0
                ? `Successfully synced ${data.count} captured payment(s) from Razorpay!`
                : 'Gateway connected: 0 payments found on Razorpay account.',
            type: 'success',
          });
        }
      }
    } catch {
      if (isManual) {
        setSyncFeedback({
          message: 'Network error connecting to payment sync endpoint.',
          type: 'error',
        });
      }
    } finally {
      setIsSyncing(false);
      if (isManual) {
        setTimeout(() => setSyncFeedback(null), 6000);
      }
    }
  }, [mergeSyncedOrders]);

  // Auto-sync live orders quietly once logged in
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      handleSyncOrders(false);
    }
  }, [isAdminAuthenticated, handleSyncOrders]);

  // Handle Login with rate limiting & hashing
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemainingSeconds > 0) return;
    const res = await loginAdmin(passwordInput);
    if (!res.success) {
      setLoginError(res.message || 'Incorrect master password. Default password is: admin');
    } else {
      setLoginError('');
      setPasswordInput('');
    }
  };

  // Open modal for new product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormTagline('');
    setFormDescription('');
    setFormPrice(29);
    setFormOriginalPrice(49);
    setFormCategory('Notion Templates');
    setFormBadge('New');
    setFormThumbnail('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80');
    setFormFormat('ZIP Bundle');
    setFormSize('25 MB');
    setFormFeatures('Instant digital download\nCommercial use license\nFree lifetime revisions');
    setFormFiles('Master Files (.ZIP)\nReadme & License Guide (PDF)');
    setIsProductModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormTagline(p.tagline);
    setFormDescription(p.longDescription || p.description);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormCategory(p.category);
    setFormBadge(p.badge);
    setFormThumbnail(p.thumbnail);
    setFormFormat(p.fileFormat);
    setFormSize(p.fileSize);
    setFormFeatures(p.features.join('\n'));
    setFormFiles(p.includedFiles.join('\n'));
    setIsProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = formFeatures.split('\n').map((s) => s.trim()).filter(Boolean);
    const filesList = formFiles.split('\n').map((s) => s.trim()).filter(Boolean);

    if (editingProduct) {
      // Update existing
      updateProduct(editingProduct.id, {
        title: formTitle,
        tagline: formTagline,
        description: formTagline,
        longDescription: formDescription,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        category: formCategory,
        badge: formBadge,
        thumbnail: formThumbnail,
        fileFormat: formFormat,
        fileSize: formSize,
        features: featuresList,
        includedFiles: filesList,
      });
    } else {
      // Create new product
      addProduct({
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: formTagline,
        description: formTagline,
        longDescription: formDescription,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        category: formCategory,
        badge: formBadge,
        rating: 5.0,
        reviewCount: 1,
        downloadsCount: 0,
        thumbnail: formThumbnail,
        gallery: [formThumbnail],
        features: featuresList,
        includedFiles: filesList,
        fileFormat: formFormat,
        fileSize: formSize,
        version: 'v1.0',
        sampleDownloadName: `${formTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Files.zip`,
      });
    }

    setIsProductModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Run Diagnostics
  const handleRunDiagnostics = () => {
    const res = runSystemDiagnostics();
    setDiagnosticsResult(res);
  };

  // Handle Backup File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBackupFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!backupFileContent) return;
    const res = restoreBackup(backupFileContent);
    setRestoreMessage({ text: res.message, error: !res.success });
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.downloadToken.toLowerCase().includes(q) ||
      (o.promoCode && o.promoCode.toLowerCase().includes(q))
    );
  });

  const exportOrdersToCsv = () => {
    if (orders.length === 0) {
      alert('No orders available to export yet. Test a checkout on the store to record an order.');
      return;
    }
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Email',
      'Items Purchased',
      'Gross Total',
      'Currency',
      'Estimated Gateway Fee (2.36%)',
      'Estimated Net Bank Payout',
      'Promo Code',
      'Digital License Token',
    ];

    const rows = orders.map((o) => {
      const gross = o.total;
      const fee = Math.round(gross * 0.0236 * 100) / 100;
      const net = Math.round((gross - fee) * 100) / 100;
      const itemsList = o.items.map((i) => `${i.quantity}x ${i.product.title}`).join('; ');

      return [
        o.id,
        `"${o.createdAt}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
        `"${itemsList.replace(/"/g, '""')}"`,
        gross.toFixed(2),
        o.currency || currency,
        fee.toFixed(2),
        net.toFixed(2),
        `"${o.promoCode || 'None'}"`,
        o.downloadToken,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCustomerDownload = (order: (typeof orders)[0]) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nexus-store-woad.vercel.app';
    const link = `${origin}/downloads/Personal_Growth_System.xlsx?order=${order.id}&token=${order.downloadToken}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(order.id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleEmailCustomerReceipt = (order: (typeof orders)[0]) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nexus-store-woad.vercel.app';
    const link = `${origin}/downloads/Personal_Growth_System.xlsx?order=${order.id}&token=${order.downloadToken}`;
    const subject = encodeURIComponent(`NEXUS Delivery: Your Personal Growth System Download (Order #${order.id})`);
    const body = encodeURIComponent(
      `Hi ${order.customerName},\n\nThank you for choosing NEXUS!\n\nHere are your order and download details:\n- Order ID: ${order.id}\n- Product: Personal Growth System (.xlsx master template)\n- License Token: ${order.downloadToken}\n\nYou can download your master spreadsheet anytime using your secure link:\n${link}\n\nIf you have any questions or need setup guidance, reply directly to this email.\n\nBest regards,\nNEXUS Team\n${settings.supportEmail || 'solution00000@outlook.com'}`
    );
    window.open(`mailto:${order.customerEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const ok = addPromoCode(newPromoCode, newPromoDiscount / 100);
    if (ok) {
      setPromoFeedback({ message: `Promo code "${newPromoCode.toUpperCase()}" (${newPromoDiscount}%) created successfully!` });
      setNewPromoCode('');
      setTimeout(() => setPromoFeedback(null), 3000);
    } else {
      setPromoFeedback({ message: 'Invalid code or discount percentage.', error: true });
    }
  };

  const handleSaveQuickAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ announcementText: quickAnnouncement });
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 2500);
  };

  const analytics = getAnalytics(trafficTimeframe);

  // Financial calculations
  const totalGrossOrders = orders.reduce((sum, o) => sum + o.total, 0);
  const totalEstimatedFees = Math.round(totalGrossOrders * 0.0236 * 100) / 100;
  const totalNetBankPayout = Math.max(0, Math.round((totalGrossOrders - totalEstimatedFees) * 100) / 100);

  // 1. LOCKED VIEW (Authentication Screen)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            Admin Master Portal
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            Protected area to enlist products, edit storefront settings, inspect system backups, and run bug diagnostics.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder={lockoutRemainingSeconds > 0 ? `Locked out (${lockoutRemainingSeconds}s)` : "Enter Admin Password (default: admin)"}
                value={passwordInput}
                disabled={lockoutRemainingSeconds > 0}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-mono disabled:opacity-50"
                autoFocus
              />
            </div>

            {lockoutRemainingSeconds > 0 ? (
              <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Security Lockout: Retry in {lockoutRemainingSeconds} seconds</span>
              </p>
            ) : loginError ? (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-lg">
                {loginError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={lockoutRemainingSeconds > 0}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{lockoutRemainingSeconds > 0 ? `Locked (${lockoutRemainingSeconds}s)` : 'Unlock Admin Dashboard'}</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
            <span>Default passcode: <code className="text-indigo-400 font-mono">admin</code></span>
            <Link href="/" className="text-zinc-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Storefront</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              ⚡
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              {settings.storeName}
            </span>
            <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono px-2 py-0.5 rounded-full uppercase font-bold">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Executive Real-Time KPI & Health Ribbon */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 border border-zinc-800 rounded-3xl p-5 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">NEXUS Executive Cockpit</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE PRODUCTION
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Storefront: <strong className="text-white">{settings.storeName}</strong> • Flagship Asset: <strong>Personal Growth System (.xlsx)</strong>
                </p>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSyncOrders(true)}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
                title="Fetch live captured payments from Razorpay"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Gateway'}</span>
              </button>

              <button
                onClick={exportOrdersToCsv}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-all cursor-pointer"
                title="Export all orders to Excel / CSV"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Orders (.CSV)</span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 border border-indigo-700/50 transition-all"
              >
                <span>Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="px-2.5 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <span>⚡ Gateway:</span>
                <span className="text-emerald-400 font-bold">Razorpay Active</span>
              </div>
            </div>
          </div>

          {syncFeedback && (
            <div
              className={`mb-4 px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-3 animate-fade-in ${
                syncFeedback.type === 'error'
                  ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                  : syncFeedback.type === 'warning'
                  ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                  : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {syncFeedback.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                ) : syncFeedback.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                )}
                <span>{syncFeedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setSyncFeedback(null)}
                className="text-zinc-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Gross Sales ({trafficTimeframe})</span>
              <span className="text-lg font-black text-white mt-0.5 block">
                {currencySymbol}{analytics.totalRevenue.toFixed(2)}
              </span>
              <span className="text-[10px] text-zinc-400">{orders.length} real checkouts</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Est. Net Bank Payout</span>
              <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                {currencySymbol}{Math.max(0, Math.round((analytics.totalRevenue * 0.9764) * 100) / 100).toFixed(2)}
              </span>
              <span className="text-[10px] text-zinc-400">After ~2.36% Razorpay fee</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Total Store Visits</span>
              <span className="text-lg font-black text-indigo-400 mt-0.5 block">
                {analytics.totalVisits.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-400">{analytics.uniqueVisitors} unique visitors</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Conversion Rate</span>
              <span className="text-lg font-black text-purple-400 mt-0.5 block">
                {analytics.conversionRate}%
              </span>
              <span className="text-[10px] text-zinc-400">AOV: {currencySymbol}{analytics.avgOrderValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'traffic'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Traffic & Conversions</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Received ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'promos'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promos & Drops ({promos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'diagnostics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Bug & System Health Check</span>
          </button>

          <button
            onClick={() => setActiveTab('backups')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'backups'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backups & Recovery</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT ENLISTMENT & EDITOR */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Digital Product Catalog</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Enlist new digital products, set prices, and manage deliverables.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filter products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enlist New Product</span>
                </button>
              </div>
            </div>

            {/* Product Table/Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                >
                  <div>
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-800 relative mb-3">
                      <SafeImage src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-950/80 text-white">
                          {p.category}
                        </span>
                        {p.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{p.tagline}</p>

                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/60 pt-2">
                      <span className="font-mono text-[11px]">{p.fileFormat}</span>
                      <span className="font-mono text-[11px]">{p.fileSize}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-white">${p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through ml-2">${p.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/80 text-rose-400 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TRAFFIC & CONVERSIONS MONITOR */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* Header & Timeframe Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl font-bold text-white">Traffic & Purchases Monitor</h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Real-time visitor analytics, conversion efficiency, and revenue tracking.
                </p>
              </div>

              {/* Day / Week / Month Toggle */}
              <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setTrafficTimeframe('day')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    trafficTimeframe === 'day'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Day (24h)
                </button>
                <button
                  type="button"
                  onClick={() => setTrafficTimeframe('week')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    trafficTimeframe === 'week'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Week (7d)
                </button>
                <button
                  type="button"
                  onClick={() => setTrafficTimeframe('month')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    trafficTimeframe === 'month'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Month (30d)
                </button>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Metric 1 */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Website Visits</span>
                  <Eye className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{analytics.totalVisits.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {analytics.uniqueVisitors.toLocaleString()} unique visitors
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Purchases Made</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{analytics.totalOrders}</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    {orders.length} real checkouts logged
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">
                    {currencySymbol}{analytics.totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Est. Net: {currencySymbol}{Math.max(0, Math.round((analytics.totalRevenue * 0.9764) * 100) / 100).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Conversion Rate</span>
                  <Percent className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{analytics.conversionRate}%</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Visits converted to buyers
                  </div>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Avg. Order Value</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-cyan-400">
                    {currencySymbol}{analytics.avgOrderValue.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Average revenue per order
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Timeline Chart Card */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-indigo-400" />
                    <span>Traffic & Purchase Conversion Timeline</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Showing visitor volume vs purchases for {trafficTimeframe === 'day' ? 'Today (by 3-hour slots)' : trafficTimeframe === 'week' ? 'Past 7 Days' : 'Past 30 Days'}.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-indigo-500" />
                    <span className="text-zinc-400">Website Visits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-zinc-400">Purchases</span>
                  </div>
                </div>
              </div>

              {/* SVG / CSS Interactive Graph */}
              <div className="pt-4 pb-2">
                {analytics.totalVisits === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border border-dashed border-zinc-800 rounded-xl p-6 text-center">
                    <LineChart className="w-8 h-8 text-zinc-600 mb-2" />
                    <p className="text-xs font-semibold text-zinc-400">No visits recorded in this timeframe ({trafficTimeframe}).</p>
                    <p className="text-[11px] text-zinc-600 mt-1 max-w-sm">
                      Real website visits and purchase activity will be plotted here live as visitors browse your store.
                    </p>
                  </div>
                ) : (
                  (() => {
                    const maxVisits = Math.max(...analytics.timeline.map((t) => t.visits), 1);
                    return (
                      <div className="flex items-end justify-between gap-2 sm:gap-4 h-56 pt-8 px-2 border-b border-zinc-800">
                        {analytics.timeline.map((point, idx) => {
                          const heightPct = point.visits > 0
                            ? Math.max(8, Math.round((point.visits / maxVisits) * 100))
                            : 0;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                              {/* Hover Tooltip */}
                              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] font-mono p-2 rounded-lg pointer-events-none shadow-xl border border-zinc-700 whitespace-nowrap z-20">
                                <div><strong>{point.label}</strong></div>
                                <div>{point.visits} visits • {point.orders} orders</div>
                                <div className="text-emerald-400">${point.revenue.toFixed(2)} sales</div>
                              </div>

                              {/* Orders Indicator Dot / Tag */}
                              {point.orders > 0 && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 mb-1.5 animate-fade-in shadow-xs">
                                  {point.orders}🛒
                                </span>
                              )}

                              {/* Bar */}
                              <div
                                style={{ height: point.visits > 0 ? `${heightPct}%` : '3px' }}
                                className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 shadow-sm ${
                                  point.visits > 0
                                    ? 'bg-gradient-to-t from-indigo-700 to-indigo-500 hover:from-indigo-600 hover:to-indigo-400'
                                    : 'bg-zinc-800/60'
                                }`}
                              />

                              {/* Label */}
                              <span className="text-[10px] font-medium text-zinc-400 mt-2 truncate w-full text-center">
                                {point.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Referrers & Funnel 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Traffic Sources & Referrers */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Top Traffic Referrers</span>
                  </h4>
                  <span className="text-[11px] text-zinc-500 font-mono">Visitor Share</span>
                </div>

                {analytics.referrers.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    <p className="font-medium text-zinc-400">No external referrers logged yet</p>
                    <p className="text-[11px] text-zinc-600 mt-1">
                      Direct visits only. Share your store link on Google, X, Instagram, or YouTube to track acquisition channels.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.referrers.map((ref, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-medium">{ref.name}</span>
                          <span className="font-mono text-zinc-400">{ref.count} visits ({ref.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            style={{ width: `${ref.percentage}%` }}
                            className="h-full rounded-full bg-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversion Funnel */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Digital Store Conversion Funnel</span>
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-semibold">{analytics.funnel.orderRate}% overall</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">1. Total Storefront Visits</span>
                      <span className="text-[10px] text-zinc-500">Landing & browsing catalog ({analytics.funnel.visits} visits)</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-400">100%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">2. Product Previews Inspected</span>
                      <span className="text-[10px] text-zinc-500">Opened Quick Preview / Spec Details ({analytics.funnel.previewClicks} clicks)</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-300">{analytics.funnel.previewRate}%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">3. Added to Cart & Checkout Open</span>
                      <span className="text-[10px] text-zinc-500">Showed direct purchase intent ({analytics.funnel.checkoutOpens} opens)</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-200">{analytics.funnel.checkoutRate}%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-emerald-300 block">4. Completed Orders & Delivered</span>
                      <span className="text-[10px] text-emerald-400">Instant file delivery received ({analytics.funnel.ordersCompleted} orders)</span>
                    </div>
                    <span className="font-mono font-black text-emerald-400">{analytics.funnel.orderRate}%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: STORE CONFIGURATION & EDIT */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Store Branding & Settings</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Edit your store name, announcement bar, support email, and promo codes.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Store Tagline</label>
                <input
                  type="text"
                  value={settingsForm.storeTagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeTagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Active Promo Code</label>
                  <input
                    type="text"
                    value={settingsForm.promoCode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-mono uppercase text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Discount Rate (0.30 = 30%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={settingsForm.promoDiscount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoDiscount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Storefront Settings</span>
                </button>

                {settingsSaved && (
                  <span className="text-xs text-emerald-400 font-semibold animate-fade-in">
                    ✓ Saved successfully to store!
                  </span>
                )}
              </div>
            </form>

            {/* Master Password Change Section */}
            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span>Change Admin Password</span>
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new master password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (newPassword.trim()) {
                      const ok = await changeAdminPassword(newPassword.trim());
                      if (ok) {
                        setPasswordChangedMessage('Admin password updated and hashed securely!');
                        setNewPassword('');
                        setTimeout(() => setPasswordChangedMessage(''), 2500);
                      } else {
                        setPasswordChangedMessage('Password must be at least 4 characters.');
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                >
                  Update
                </button>
              </div>
              {passwordChangedMessage && (
                <p className="text-xs text-emerald-400 font-medium">{passwordChangedMessage}</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS LOG & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <span>Sales & Customer Orders ({orders.length})</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Instant customer fulfillment links, pre-filled email receipts, and net bank payouts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSyncOrders(true)}
                  disabled={isSyncing}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 border border-zinc-700 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  title="Fetch live captured payments from Razorpay"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Gateway Payments'}</span>
                </button>

                <button
                  type="button"
                  onClick={exportOrdersToCsv}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-2 border border-zinc-700 shadow-md transition-all cursor-pointer"
                  title="Download all orders in Excel/CSV format"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Export to Excel (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Financial Payout Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Gross Sales Recorded</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {currencySymbol}{totalGrossOrders.toLocaleString()}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block">{orders.length} total paid orders</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Estimated Gateway Fees</span>
                <span className="text-2xl font-black text-rose-400 mt-1 block">
                  -{currencySymbol}{totalEstimatedFees.toLocaleString()}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block">~2.36% (2% + 18% GST Razorpay rate)</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-emerald-950/30 border border-emerald-900/40">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Estimated Net In Bank</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {currencySymbol}{totalNetBankPayout.toLocaleString()}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block">Actual money deposited into your account</span>
              </div>
            </div>

            {/* Order Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search orders by customer name, email, order ID, promo code, or token..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                <h4 className="font-bold text-sm text-zinc-300">No orders logged yet</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Complete a checkout on your storefront to see order tracking and link generation live.
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
                No orders match your search query &ldquo;{orderSearch}&rdquo;.
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-zinc-800/60 text-zinc-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Gross Total</th>
                      <th className="p-4">Est. Net</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Customer Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredOrders.map((o) => {
                      const net = Math.max(0, Math.round((o.total * 0.9764) * 100) / 100);
                      const isCopied = copiedLink === o.id;

                      return (
                        <tr key={o.id} className="hover:bg-zinc-800/40">
                          <td className="p-4 font-mono font-bold text-indigo-400">
                            <div>{o.id}</div>
                            {o.promoCode && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                {o.promoCode}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{o.customerName}</div>
                            <div className="text-zinc-500 font-mono text-[11px]">{o.customerEmail}</div>
                          </td>
                          <td className="p-4">
                            {o.items.map((i, idx) => (
                              <div key={idx} className="text-zinc-300 truncate max-w-xs font-medium">
                                {i.quantity}x {i.product.title}
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-bold text-white text-sm">
                            {o.currency === 'INR' ? '₹' : '$'}{o.total.toFixed(2)}
                          </td>
                          <td className="p-4 font-bold text-emerald-400 text-sm">
                            {o.currency === 'INR' ? '₹' : '$'}{net.toFixed(2)}
                          </td>
                          <td className="p-4 text-zinc-400 text-[11px]">{o.createdAt}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* 1-Click Copy Customer Link */}
                              <button
                                type="button"
                                onClick={() => handleCopyCustomerDownload(o)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isCopied
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                                }`}
                                title="Copy direct download link for this customer"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Copy Link</span>
                                  </>
                                )}
                              </button>

                              {/* 1-Click Email Receipt */}
                              <button
                                type="button"
                                onClick={() => handleEmailCustomerReceipt(o)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-700/50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                title="Open pre-filled email receipt in Outlook/Gmail"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Email Receipt</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: PROMOS & CAMPAIGNS */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                <span>Promo Codes & Seasonal Drops</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Create influencer coupons, seasonal flash discounts, and track revenue per promo code.
              </p>
            </div>

            {/* Quick Announcement Bar Editor */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-sm font-bold text-white mb-2">Storefront Announcement Banner</h3>
              <form onSubmit={handleSaveQuickAnnouncement} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={quickAnnouncement}
                  onChange={(e) => setQuickAnnouncement(e.target.value)}
                  placeholder="e.g. Launch Special: Use code LAUNCH30 for 30% OFF everything!"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Update Announcement</span>
                </button>
              </form>
              {announcementSaved && (
                <p className="text-xs text-emerald-400 font-medium mt-2">✓ Top banner updated on live store!</p>
              )}
            </div>

            {/* Create New Promo Code Form */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-sm font-bold text-white mb-3">Create New Campaign Code</h3>
              <form onSubmit={handleCreatePromo} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. YOUTUBE25"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-mono uppercase text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Discount Rate (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="90"
                      step="5"
                      required
                      value={newPromoDiscount}
                      onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-zinc-400">%</span>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Promo Code</span>
                  </button>
                </div>
              </form>

              {promoFeedback && (
                <p className={`text-xs mt-3 font-medium ${promoFeedback.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Promo Codes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {promos.map((p) => (
                <div key={p.code} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-800/60">
                        {p.code}
                      </span>
                      <span className="text-xs font-black text-emerald-400">
                        {(p.discount * 100).toFixed(0)}% OFF
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-zinc-400">
                      <div className="flex justify-between">
                        <span>Orders Used:</span>
                        <strong className="text-white">{p.usageCount}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue Driven:</span>
                        <strong className="text-emerald-400">${p.revenue.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => togglePromoCode(p.code)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        p.active
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {p.active ? '● Active' : '○ Paused'}
                    </button>

                    <button
                      type="button"
                      onClick={() => deletePromoCode(p.code)}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete promo code"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BUG CHECK & DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">System Diagnostics & Bug Checker</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verify local storage status, pricing integrity, catalog schemas, and server health.
                </p>
              </div>

              <button
                onClick={handleRunDiagnostics}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Bug & Health Scan</span>
              </button>
            </div>

            {/* Diagnostic Results Card */}
            {diagnosticsResult && (
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Scan Results ({diagnosticsResult.timestamp})
                  </span>
                  <span className="text-[11px] text-zinc-500">All tests executed</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {diagnosticsResult.checks.map((chk, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700/60 flex items-start gap-3 text-xs"
                    >
                      {chk.status === 'healthy' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-white">{chk.name}</div>
                        <div className="text-zinc-400 mt-0.5">{chk.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live System Event Log */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Live Event Log</h3>
                </div>
                <button
                  onClick={clearLogs}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Clear Logs
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-zinc-500 text-xs italic">No event logs recorded yet.</p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-zinc-800/40 border border-zinc-800"
                    >
                      <span className="text-zinc-500 text-[10px] shrink-0">{log.timestamp}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          log.type === 'success'
                            ? 'bg-emerald-950 text-emerald-400'
                            : log.type === 'error'
                            ? 'bg-rose-950 text-rose-400'
                            : log.type === 'warning'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {log.type}
                      </span>
                      <span className="text-zinc-300 break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BACKUPS & RECOVERY */}
        {activeTab === 'backups' && (
          <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Store Backups & Recovery</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Download snapshots of your entire store (products, settings, sales) to avoid data loss.
              </p>
            </div>

            {/* Export Section */}
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Export Snapshot</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Generate an immediate JSON backup of all {products.length} products, branding settings, and orders.
              </p>
              <button
                type="button"
                onClick={createBackup}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Store Backup JSON</span>
              </button>
            </div>

            {/* Restore Section */}
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Restore From Backup</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Select a previously exported JSON backup file to restore products and settings.
              </p>
              
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
              />

              {backupFileContent && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleApplyRestore}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Apply & Restore Backup Now</span>
                  </button>
                </div>
              )}

              {restoreMessage && (
                <p className={`text-xs mt-2 ${restoreMessage.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {restoreMessage.text}
                </p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            <h3 className="text-xl font-bold text-white mb-1">
              {editingProduct ? 'Edit Digital Product' : 'Enlist New Digital Product'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Fill in the product details below. Changes are reflected live on the storefront immediately.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Creator OS: Notion Workspace"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Tagline (One-line Hook)</label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. All-in-one Notion workspace for creators"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Original / Strikethrough Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Notion Templates">Notion Templates</option>
                    <option value="Design & 3D">Design & 3D</option>
                    <option value="E-Books & Guides">E-Books & Guides</option>
                    <option value="Developer Kits">Developer Kits</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Badge Tag</label>
                  <select
                    value={formBadge || 'New'}
                    onChange={(e) => setFormBadge(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="Hot">Hot</option>
                    <option value="New">New</option>
                    <option value="Popular">Popular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">File Format</label>
                  <input
                    type="text"
                    value={formFormat}
                    onChange={(e) => setFormFormat(e.target.value)}
                    placeholder="e.g. PDF + Notion Link"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">File Size</label>
                  <input
                    type="text"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    placeholder="e.g. 45 MB"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Preview Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="In-depth details about what the customer is buying..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Key Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Included Deliverable Files (1 per line)</label>
                <textarea
                  rows={2}
                  value={formFiles}
                  onChange={(e) => setFormFiles(e.target.value)}
                  placeholder="Master Files (.ZIP)&#10;Setup Video (MP4)"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
