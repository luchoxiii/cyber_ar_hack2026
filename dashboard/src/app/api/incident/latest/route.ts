import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scenario = searchParams.get('scenario') || 'c2_multistage';

    const incidentsPath = path.join(process.cwd(), 'public', 'mock_incidents.json');
    if (fs.existsSync(incidentsPath)) {
      const data = JSON.parse(fs.readFileSync(incidentsPath, 'utf8'));
      const found = data.find((inc: { scenario_key?: string }) => inc.scenario_key === scenario) || data[0];
      return NextResponse.json(found);
    }

    // Fallback directo si no encontrara el archivo
    const singlePath = path.join(process.cwd(), 'public', 'mock_incident.json');
    if (fs.existsSync(singlePath)) {
      const data = JSON.parse(fs.readFileSync(singlePath, 'utf8'));
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'No incident data found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read incident data', details: String(err) }, { status: 500 });
  }
}
