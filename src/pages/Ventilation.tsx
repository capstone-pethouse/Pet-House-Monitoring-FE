import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { 
  Wind, 
  Power,
  Thermometer,
  Calendar,
  Clock,
  Settings,
  TrendingUp,
  Plus,
  Trash2,
  Play,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface VentilationHistory {
  id: string;
  timestamp: string;
  duration: number;
  intensity: number;
  mode: 'manual' | 'auto';
  trigger?: string;
}

interface AutoRule {
  id: string;
  timeStart: string;
  timeEnd: string;
  temp: number;
  intensity: number;
  enabled: boolean;
}

const defaultNewRule = {
  timeStart: '09:00',
  timeEnd: '21:00',
  temp: 25,
  intensity: 70,
};

export function Ventilation() {
  const [isRunning, setIsRunning] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [autoMode, setAutoMode] = useState(false);

  const [autoRules, setAutoRules] = useState<AutoRule[]>([
    { id: '1', timeStart: '08:00', timeEnd: '20:00', temp: 25, intensity: 70, enabled: true },
    { id: '2', timeStart: '08:00', timeEnd: '20:00', temp: 27, intensity: 90, enabled: true },
    { id: '3', timeStart: '20:00', timeEnd: '08:00', temp: 26, intensity: 60, enabled: false },
  ]);

  const [newRule, setNewRule] = useState({ ...defaultNewRule });
  const [editingRule, setEditingRule] = useState<AutoRule | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [history] = useState<VentilationHistory[]>([
    { id: '1', timestamp: '2026-03-15T14:30:00', duration: 10, intensity: 70, mode: 'auto', trigger: '온도 26°C 도달' },
    { id: '2', timestamp: '2026-03-15T11:30:00', duration: 15, intensity: 80, mode: 'manual' },
    { id: '3', timestamp: '2026-03-15T08:45:00', duration: 12, intensity: 60, mode: 'auto', trigger: '온도 25°C 도달' },
    { id: '4', timestamp: '2026-03-14T16:20:00', duration: 20, intensity: 90, mode: 'auto', trigger: '온도 27°C 도달' },
    { id: '5', timestamp: '2026-03-14T13:10:00', duration: 8, intensity: 50, mode: 'manual' },
  ]);


  const handleToggleVentilation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success(`환풍기 작동 시작 (강도: ${intensity}%)`);
      if (autoMode) {
        setAutoMode(false);
        toast.info("수동 제어 시작으로 자동 모드가 비활성화되었습니다");
      }
    } else {
      toast.info("환풍기 중지");
    }
  };

  const handleIntensityChange = (value: number[]) => {
    setIntensity(value[0]);
    if (isRunning) {
      toast.info(`강도 변경: ${value[0]}%`);
    }
  };

  const handleAutoVentilation = () => {
    setAutoMode(!autoMode);
    if(!autoMode) {
      toast.success("자동 환풍기 가동");
      if(isRunning) {
        setIsRunning(false);
        toast.info("자동 제어 시작으로 수동 모드가 비활성되었습니다");
      }
    } else {
      toast.info("자동 환풍기 중지");
    }
  }

  const handleAddRule = () => {
    const rule: AutoRule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true,
    };
    setAutoRules([...autoRules, rule]);
    setNewRule({ ...defaultNewRule });
    toast.success("규칙이 추가되었습니다");
  };

  const handleDeleteRule = (id: string) => {
    setAutoRules(autoRules.filter(r => r.id !== id));
    toast.success("규칙이 삭제되었습니다");
  };

  const handleToggleRule = (id: string) => {
    setAutoRules(autoRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleEditRule = (rule: AutoRule) => {
    setEditingRule({ ...rule });
    setIsEditDialogOpen(true);
  };

  const handleSaveEditRule = () => {
    if (!editingRule) return;
    setAutoRules(autoRules.map(r => r.id === editingRule.id ? editingRule : r));
    setIsEditDialogOpen(false);
    setEditingRule(null);
    toast.success("규칙이 수정되었습니다");
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('ko-KR'),
      time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">환풍기 제어</h2>
        <p className="text-gray-500 mt-2">펫하우스 내부 공기 순환을 관리하세요</p>
      </div>

      {/* Manual Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control Panel */}
        <Card className={`border-2 transition-all ${
          isRunning 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-200 bg-white'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className={`w-5 h-5 ${isRunning ? 'text-green-600 animate-spin' : 'text-gray-600'}`} />
              수동 제어
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Power Button */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isRunning ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <Power className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">환풍기 전원</div>
                  <div className="text-sm text-gray-500">
                    {isRunning ? '작동 중' : '정지됨'}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleToggleVentilation}
                className={isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
              >
                {isRunning ? '중지' : '시작'}
              </Button>
            </div>

            {/* Intensity Control */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
              <Label className="text-base font-semibold">강도 조절</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[intensity]}
                  onValueChange={handleIntensityChange}
                  max={100}
                  step={10}
                  className="flex-1"
                  disabled={!isRunning}
                />
                <div className="w-16 text-center">
                  <div className="text-2xl font-bold text-gray-900">{intensity}</div>
                  <div className="text-xs text-gray-500">%</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleIntensityChange([30])} disabled={!isRunning}>약</Button>
                <Button variant="outline" size="sm" onClick={() => handleIntensityChange([60])} disabled={!isRunning}>중</Button>
                <Button variant="outline" size="sm" onClick={() => handleIntensityChange([90])} disabled={!isRunning}>강</Button>
              </div>
            </div>

            {/* Current Status */}
            {isRunning && (
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Wind className="w-5 h-5 animate-spin" />
                  <span className="font-medium">환풍 작동 중 ({intensity}% 강도)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auto Mode Settings */}
        <Card className={`border-2 transition-all ${
          autoMode ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Settings className="w-5 h-5" />
              자동 제어 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Auto Mode Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              autoMode ? 'bg-white border-blue-200' : 'bg-gray-100 border-gray-200'
            }`}>
              <div>
                <div className="font-semibold">자동 모드</div>
                <div className="text-sm mt-1">
                  시간대별 온도 규칙에 따라 자동으로 작동
                </div>
              </div>
              <Button
                onClick={handleAutoVentilation}
                className={autoMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
              >
                {autoMode ? '중지' : '시작'}
              </Button>
            </div>


            {/* Summary */}
            <div className={`p-4 rounded-lg border transition-all ${
              autoMode ? 'bg-white border-blue-200' : 'bg-gray-100 border-gray-200 opacity-50'
            }`}>
              <div className={`text-sm font-medium mb-3 ${autoMode ? 'text-gray-700' : 'text-gray-400'}`}>활성 규칙 요약</div>
              {autoRules.filter(r => r.enabled).length === 0 ? (
                <div className={`text-sm ${autoMode ? 'text-gray-400' : 'text-gray-300'}`}>활성화된 규칙이 없습니다</div>
              ) : (
                <div className="space-y-1.5">
                  {autoRules.filter(r => r.enabled).map(r => (
                    <div key={r.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${autoMode ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      <span className={autoMode ? 'text-gray-600' : 'text-gray-400'}>
                        {r.timeStart}~{r.timeEnd} / {r.temp}°C 이상 → 강도 {r.intensity}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!autoMode && (
              <div className="p-3 bg-gray-200 border border-gray-300 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Settings className="w-4 h-4" />
                  <span>자동 모드가 비활성화되어 있습니다. 스위치를 켜면 자동 제어가 시작됩니다.</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auto Rules Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-blue-600" />
            자동 제어 규칙
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!autoMode}>
                <Plus className="w-4 h-4 mr-2" />
                규칙 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 자동 제어 규칙 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>시작 시간</Label>
                    <Input
                      type="time"
                      value={newRule.timeStart}
                      onChange={(e) => setNewRule({ ...newRule, timeStart: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>종료 시간</Label>
                    <Input
                      type="time"
                      value={newRule.timeEnd}
                      onChange={(e) => setNewRule({ ...newRule, timeEnd: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label>기준 온도 (이상일 시 작동)</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input
                      type="number"
                      value={newRule.temp}
                      onChange={(e) => setNewRule({ ...newRule, temp: Number(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-gray-600 font-medium">°C</span>
                  </div>
                </div>
                <div>
                  <Label>환풍기 강도</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={newRule.intensity}
                      onChange={(e) => setNewRule({ ...newRule, intensity: Math.min(100, Math.max(1, Number(e.target.value))) })}
                      className="flex-1"
                    />
                    <span className="text-gray-600 font-medium">%</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  💡 {newRule.timeStart} ~ {newRule.timeEnd} 사이에 온도가 {newRule.temp}°C 이상이면 강도 {newRule.intensity}%로 작동합니다
                </div>
                <Button onClick={handleAddRule} className="w-full">
                  추가하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {!autoMode && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center gap-2">
              <Settings className="w-4 h-4 flex-shrink-0" />
              자동 모드가 꺼져 있어 아래 규칙이 적용되지 않습니다.
            </div>
          )}
          <div className="space-y-3">
            {autoRules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  rule.enabled && autoMode
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    rule.enabled && autoMode ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    <Wind className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {rule.timeStart} ~ {rule.timeEnd}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-red-400" />
                        {rule.temp}°C 이상
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-blue-400" />
                        강도 {rule.intensity}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                    {rule.enabled ? '활성' : '비활성'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditRule(rule)}
                    title="규칙 수정"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleRule(rule.id)}
                    title="활성/비활성 전환"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRule(rule.id)}
                    title="규칙 삭제"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}

            {autoRules.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                등록된 자동 제어 규칙이 없습니다. 규칙을 추가해주세요.
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>자동 제어 규칙 수정</DialogTitle>
          </DialogHeader>
          {editingRule && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>시작 시간</Label>
                  <Input
                    type="time"
                    value={editingRule.timeStart}
                    onChange={(e) => setEditingRule({ ...editingRule, timeStart: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>종료 시간</Label>
                  <Input
                    type="time"
                    value={editingRule.timeEnd}
                    onChange={(e) => setEditingRule({ ...editingRule, timeEnd: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label>기준 온도 (이상일 시 작동)</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    type="number"
                    value={editingRule.temp}
                    onChange={(e) => setEditingRule({ ...editingRule, temp: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-gray-600 font-medium">°C</span>
                </div>
              </div>
              <div>
                <Label>환풍기 강도</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={editingRule.intensity}
                    onChange={(e) => setEditingRule({ ...editingRule, intensity: Math.min(100, Math.max(1, Number(e.target.value))) })}
                    className="flex-1"
                  />
                  <span className="text-gray-600 font-medium">%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                💡 {editingRule.timeStart} ~ {editingRule.timeEnd} 사이에 온도가 {editingRule.temp}°C 이상이면 강도 {editingRule.intensity}%로 작동합니다
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditDialogOpen(false)}>취소</Button>
                <Button className="flex-1" onClick={handleSaveEditRule}>저장하기</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wind className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-500">오늘 작동 횟수</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2.5시간</div>
                <div className="text-sm text-gray-500">오늘 총 작동 시간</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">68%</div>
                <div className="text-sm text-gray-500">평균 작동 강도</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-500">자동 모드 비율</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>환풍 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((item) => {
              const { date, time } = formatDateTime(item.timestamp);
              return (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.mode === 'auto' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <Wind className={`w-5 h-5 ${item.mode === 'auto' ? 'text-blue-600' : 'text-purple-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{item.duration}분 작동</span>
                      <Badge variant={item.mode === 'auto' ? 'default' : 'secondary'}>
                        {item.mode === 'auto' ? '자동' : '수동'}
                      </Badge>
                      <Badge variant="outline">강도 {item.intensity}%</Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {date} {time}
                    </div>
                    {item.trigger && (
                      <div className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {item.trigger}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}